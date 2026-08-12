package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (a *application) getHealthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, SuccessResponse{
		Message: "ok",
	})
}
