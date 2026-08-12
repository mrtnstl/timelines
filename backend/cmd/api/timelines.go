package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (a *application) getTimelinesHandler(c *gin.Context) {

	c.JSON(http.StatusOK, SuccessResponse{
		Data: []string{"tl1", "tl2"},
	})
}

func (a *application) getTimelineByIDHandler(c *gin.Context) {
	id := c.Param(RouteParamKeyTimelineID)

	c.JSON(http.StatusOK, SuccessResponse{
		Data: id,
	})
}

func (a *application) editTimelineHandler(c *gin.Context) {
	id := c.Param(RouteParamKeyTimelineID)
	c.JSON(http.StatusOK, SuccessResponse{
		Message: fmt.Sprintf("successfully edited timeline %s", id),
	})
}

func (a *application) deleteTimelineHandler(c *gin.Context) {
	id := c.Param(RouteParamKeyTimelineID)
	shouldDeletePermanently := c.Query(QueryParamKeyIsHardDelete)

	var deletionKind string

	if shouldDeletePermanently == "true" {
		deletionKind = "hard"
	} else {
		deletionKind = "soft"
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Message: fmt.Sprintf("%s deleted timeline %s", deletionKind, id),
	})
}

func (a *application) createTimelineHandler(c *gin.Context) {

	c.JSON(http.StatusCreated, SuccessResponse{
		Message: fmt.Sprintf("created new timeline with id %s", "new_id_002"),
		Data: map[string]any{
			"id":      "new_id_002",
			"version": 1,
		},
	})
}

func (a *application) getPublicTimelineByIDHandler(c *gin.Context) {
	id := c.Param(RouteParamKeyTimelineID)

	c.JSON(http.StatusOK, SuccessResponse{
		Data: id,
	})
}
