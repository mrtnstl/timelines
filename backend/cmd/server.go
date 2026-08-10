package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mrtnstl/timelines/internal/store"
)

type application struct {
	config config
	store  store.Store
}

func (a *application) init() *gin.Engine {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	return r
}

func (a *application) start(g *gin.Engine) error {
	return g.Run(a.config.addr)
}
