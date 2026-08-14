package main

import (
	"errors"
	"net/http"
	"reflect"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/mrtnstl/timelines/internal/store"
)

func (a *application) validateRequest(requestStruct any) gin.HandlerFunc {
	reqType := reflect.TypeOf(requestStruct)
	if reqType == nil {
		panic("requestStruct must be non-nil")
	}
	return func(c *gin.Context) {
		req := reflect.New(reqType).Interface()
		if err := c.ShouldBindJSON(req); err != nil {
			a.badRequestResponse(c, err)
			return
		}

		c.Set(CtxKeyValidatedRequest, req)
		c.Next()
	}
}

func (a *application) verifyTimelineOwnership() gin.HandlerFunc {
	return func(c *gin.Context) {
		// TODO: get userID from JWT
		userID := "11111111-1111-1111-1111-111111111111"

		timelineID := c.Param(RouteParamKeyTimelineID)
		if timelineID == "" {
			a.badRequestResponse(c, errors.New("timelineID is required"))
			return
		}

		_, err := a.store.Timelines.GetByID(c.Request.Context(), timelineID, userID)
		if err != nil {
			switch {
			case errors.Is(err, store.ErrNotFound):
				a.notFoundResponse(c)
			default:
				a.internalServerErrorResponse(c)
				c.Abort()
			}
			return
		}

		c.Next()
	}
}

func (a *application) corsMW() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins:     []string{a.config.frontendURL},
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPatch, http.MethodDelete},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           time.Hour * 12,
	})
}
