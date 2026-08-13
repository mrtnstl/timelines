package main

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/mrtnstl/timelines/internal/store"
	"github.com/mrtnstl/timelines/internal/utils/crypto"
)

func (a *application) getTimelinesHandler(c *gin.Context) {
	// get ownerID from JWT
	ownerID := "11111111-1111-1111-1111-111111111111"

	timelines, err := a.store.Timelines.GetByOwnerID(c.Request.Context(), ownerID)
	if err != nil {
		a.internalServerErrorResponse(c)
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Data: timelines,
	})
}

func (a *application) getTimelineByIDHandler(c *gin.Context) {
	id := c.Param(RouteParamKeyTimelineID)

	//ownerID from JWT
	ownerID := "11111111-1111-1111-1111-111111111111"

	timeline, err := a.store.Timelines.GetByID(c.Request.Context(), id, ownerID)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			a.notFoundResponse(c)
			return
		}
		a.internalServerErrorResponse(c)
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Data: timeline,
	})
}

func (a *application) editTimelineHandler(c *gin.Context) {
	id := c.Param(RouteParamKeyTimelineID)

	//ownerID from JWT
	ownerID := "11111111-1111-1111-1111-111111111111"

	timelineFromContext, ok := c.Get(CtxKeyValidatedRequest)
	if !ok {
		a.internalServerErrorResponse(c)
		return
	}
	updatePayload, ok := timelineFromContext.(*UpdateTimelineRequest)
	if !ok {
		a.internalServerErrorResponse(c)
		return
	}

	existingTimeline, err := a.store.Timelines.GetByID(c.Request.Context(), id, ownerID)
	if err != nil {
		a.notFoundResponse(c)
		return
	}

	updatedTimeline := store.Timeline{
		ID:          existingTimeline.ID,
		Title:       existingTimeline.Title,
		IsPublished: existingTimeline.IsPublished,
		PublicID:    existingTimeline.PublicID,
		Version:     updatePayload.Version,
	}

	if updatePayload.Title != "" {
		updatedTimeline.Title = updatePayload.Title
	}

	if updatePayload.IsPublished != nil {
		if existingTimeline.IsPublished && !*updatePayload.IsPublished {
			newPublicID, err := crypto.GenTimelinePublicID()
			if err != nil {
				a.internalServerErrorResponse(c)
				return
			}
			updatedTimeline.PublicID = newPublicID
		}
		updatedTimeline.IsPublished = *updatePayload.IsPublished
	}

	if err := a.store.Timelines.Update(c.Request.Context(), &updatedTimeline); err != nil {
		if errors.Is(err, store.ErrNotFound) {
			a.notFoundResponse(c)
			return
		}
		a.internalServerErrorResponse(c)
		return
	}

	// TODO: update cache

	c.JSON(http.StatusOK, SuccessResponse{
		Message: fmt.Sprintf("successfully edited timeline %s", id),
		Data: map[string]any{
			"new_version": updatedTimeline.Version,
		},
	})
}

func (a *application) deleteTimelineHandler(c *gin.Context) {
	id := c.Param(RouteParamKeyTimelineID)
	isHardDeleteParam := c.DefaultQuery(QueryParamKeyIsHardDelete, "false")
	if isHardDeleteParam == "" {
		isHardDeleteParam = "false"
	}

	shouldDeletePermanently, err := strconv.ParseBool(isHardDeleteParam)
	if err != nil {
		a.badRequestResponse(c, errors.New("'hard' query parameter must be true or false"))
		return
	}

	if shouldDeletePermanently {
		if err := a.store.Timelines.HardDelete(c.Request.Context(), id); err != nil {
			switch {
			case errors.Is(err, store.ErrNotFound):
				a.notFoundResponse(c)
			default:
				a.internalServerErrorResponse(c)
			}
			return
		}
	} else {
		if err := a.store.Timelines.SoftDelete(c.Request.Context(), id); err != nil {
			switch {
			case errors.Is(err, store.ErrNotFound):
				a.notFoundResponse(c)
			default:
				a.internalServerErrorResponse(c)
			}
			return
		}
	}

	// TODO: delete from cache

	c.JSON(http.StatusOK, SuccessResponse{
		Message: fmt.Sprintf("deleted timeline %s (hard delete: %t)", id, shouldDeletePermanently),
	})
}

func (a *application) createTimelineHandler(c *gin.Context) {
	//ownerID from JWT
	ownerID := "11111111-1111-1111-1111-111111111111"

	timelineFromContext, ok := c.Get(CtxKeyValidatedRequest)
	if !ok {
		a.internalServerErrorResponse(c)
		return
	}
	timelinePayload, ok := timelineFromContext.(*CreateTimelineRequest)
	if !ok {
		a.internalServerErrorResponse(c)
		return
	}

	newPublicID, err := crypto.GenTimelinePublicID()
	if err != nil {
		a.internalServerErrorResponse(c)
		return
	}

	newTimeline := store.Timeline{
		Title:    timelinePayload.Title,
		OwnerID:  ownerID,
		PublicID: fmt.Sprintf("%x", newPublicID),
	}

	if err := a.store.Timelines.Create(c.Request.Context(), &newTimeline); err != nil {
		a.internalServerErrorResponse(c)
		return
	}

	c.JSON(http.StatusCreated, SuccessResponse{
		Message: fmt.Sprintf("created new timeline with id %s", newTimeline.ID),
		Data:    newTimeline,
	})
}

func (a *application) getPublicTimelineByPublicIDHandler(c *gin.Context) {
	publicID := c.Param(RouteParamKeyTimelinePublicID)

	// TODO: check redis

	timeline, err := a.store.Timelines.GetPublishedByPublicID(c.Request.Context(), publicID)
	if err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			a.notFoundResponse(c)
		default:
			a.internalServerErrorResponse(c)
		}
		return
	}
	events, err := a.store.TimelineEvents.GetByTimelineID(c.Request.Context(), timeline.ID)
	if err != nil {
		a.internalServerErrorResponse(c)
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Data: map[string]any{
			"timeline": timeline,
			"events":   events,
		},
	})
}
