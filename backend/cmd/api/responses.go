package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type SuccessResponse struct {
	Data    any    `json:"data,omitempty"`
	Message string `json:"message,omitempty"`
}

type ErrorResponse struct {
	Error string `json:"error"`
	Cause string `json:"message,omitempty"`
}

func (a *application) notFoundResponse(c *gin.Context) {
	c.JSON(http.StatusNotFound, ErrorResponse{
		Error: "record not found",
	})
}
func (a *application) internalServerErrorResponse(c *gin.Context) {
	c.JSON(http.StatusInternalServerError, ErrorResponse{
		Error: "something went wrong",
	})
}
func (a *application) badRequestResponse(c *gin.Context, err error) {
	c.AbortWithStatusJSON(http.StatusBadRequest, ErrorResponse{
		Error: "bad request",
		Cause: err.Error(),
	})
}
