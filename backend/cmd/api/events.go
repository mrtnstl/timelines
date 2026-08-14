package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mrtnstl/timelines/internal/store"
)

func (a *application) getEventsHandler(c *gin.Context) {
	timelineID := c.Param(RouteParamKeyTimelineID)

	timelineEvents, err := a.store.TimelineEvents.GetByTimelineID(c.Request.Context(), timelineID)
	if err != nil {
		a.internalServerErrorResponse(c)
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Data: timelineEvents,
	})
}

func (a *application) createEventHandler(c *gin.Context) {
	timelineID := c.Param(RouteParamKeyTimelineID)
	if timelineID == "" {
		a.badRequestResponse(c, errors.New("'timelineID' must be specified"))
		return
	}

	eventFromContext, ok := c.Get(CtxKeyValidatedRequest)
	if !ok {
		a.internalServerErrorResponse(c)
		return
	}
	eventPayload, ok := eventFromContext.(*CreateEventRequest)
	if !ok {
		log.Println("CreateEventRequest payload type assertion error")
		a.internalServerErrorResponse(c)
		return
	}

	serial := eventPayload.Serial
	if serial == nil {
		lastSerial, err := a.store.TimelineEvents.GetLargestSerial(c.Request.Context(), timelineID)
		if err != nil {
			a.internalServerErrorResponse(c)
			return
		}
		nextSerial := float64(lastSerial + 1)
		serial = &nextSerial
	}

	description := ""
	if eventPayload.Description != nil {
		description = *eventPayload.Description
	}

	newEvent := store.TimelineEvent{
		TimelineID:  timelineID,
		Title:       eventPayload.Title,
		Date:        eventPayload.Date,
		Description: description,
		Image:       eventPayload.Image,
		Serial:      int(*serial),
	}

	if err := a.store.TimelineEvents.Create(c.Request.Context(), &newEvent); err != nil {
		a.internalServerErrorResponse(c)
		return
	}

	// TODO: check cache, invalidate or refresh if needed

	c.JSON(http.StatusOK, SuccessResponse{
		Message: fmt.Sprintf("created new event with id %s", newEvent.ID),
		Data:    newEvent,
	})
}

func (a *application) editEventHandler(c *gin.Context) {
	//userID:= c.GetString("userID")
	userID := "11111111-1111-1111-1111-111111111111"
	if userID == "" {
		a.unauthorizedResponse(c)
		return
	}
	
	// TODO: stricter event ownership check
	//timelineID := c.Param(RouteParamKeyTimelineID)
	eventID := c.Param(RouteParamKeyEventID)

	updateFromContext, ok :=c.Get(CtxKeyValidatedRequest)
	if !ok {
		a.internalServerErrorResponse(c)
		return
	}
	updatePayload, ok := updateFromContext.(*UpdateEventRequest)
	if !ok {
		a.internalServerErrorResponse(c)
		return
	}

	existingEvent, err := a.store.TimelineEvents.GetByID(c.Request.Context(), eventID)
	if err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			a.notFoundResponse(c)
		default:
			a.internalServerErrorResponse(c)
		}
		return
	}

	existingEvent.Version = updatePayload.Version

	if updatePayload.Title != nil {
		existingEvent.Title = *updatePayload.Title
	}
	if updatePayload.Date != nil {
		existingEvent.Date = *updatePayload.Date
	}
	if updatePayload.Description != nil {
		existingEvent.Description = *updatePayload.Description
	}
	if updatePayload.Image != nil {
		existingEvent.Image = updatePayload.Image
	}
	if updatePayload.Serial != nil {
		existingEvent.Serial = *updatePayload.Serial
	}

	if err := a.store.TimelineEvents.Update(c.Request.Context(), &existingEvent, userID); err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			a.notFoundResponse(c)
		default:
			a.internalServerErrorResponse(c)
		}
		return
	}

	// TODO: check cache

	c.JSON(http.StatusOK, SuccessResponse{
		Message: fmt.Sprintf("successfully edited event %s", eventID),
		Data: map[string]any{
			"new_version": existingEvent.Version,
		},
	})
}

func (a *application) deleteEventHandler(c *gin.Context) {
	//userID := c.GetString("userID")
	userID :="11111111-1111-1111-1111-111111111111"
	if userID == "" {
		a.unauthorizedResponse(c)
		return
	}

	eventID := c.Param(RouteParamKeyEventID)

	if err := a.store.TimelineEvents.Delete(c.Request.Context(), eventID, userID); err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			a.notFoundResponse(c)
		default:
			a.internalServerErrorResponse(c)
		}
		return
	}

	// TODO: check cache

	c.JSON(http.StatusOK, SuccessResponse{
		Message: fmt.Sprintf("deleted event %s", eventID),
	})
}
