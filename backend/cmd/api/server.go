package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/mrtnstl/timelines/internal/cache"
	"github.com/mrtnstl/timelines/internal/store"
)

const (
	RouteParamKeyTimelineID       = "id"
	RouteParamKeyTimelinePublicID = "publicID"
	QueryParamKeyIsHardDelete     = "hard"
	RouteParamKeyEventID          = "eventID"
)
const (
	CtxKeyValidatedRequest = "validatedRequest"
)

type application struct {
	config config
	store  store.Store
	cache  cache.Store
}

func (a *application) initRoutes() http.Handler {
	r := gin.New()

	r.Use(gin.Recovery())
	r.Use(gin.Logger())
	r.Use(a.corsMW())

	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", a.getHealthHandler)
		tl := v1.Group("/timelines")
		{
			tl.GET("", a.getTimelinesHandler)
			tl.GET(":id", a.getTimelineByIDHandler)
			tl.PATCH(":id", a.validateRequest(UpdateTimelineRequest{}), a.editTimelineHandler)
			tl.DELETE(":id", a.deleteTimelineHandler)
			tl.POST("", a.validateRequest(CreateTimelineRequest{}), a.createTimelineHandler)

			te := tl.Group("/:id/events")
			// TODO: need a better solution for ownership checks
			te.Use(a.verifyTimelineOwnership())
			{
				te.GET("", a.getEventsHandler)
				te.POST("", a.validateRequest(CreateEventRequest{}), a.createEventHandler)
				te.PATCH(":eventID", a.validateRequest(UpdateEventRequest{}), a.editEventHandler)
				te.DELETE(":eventID", a.deleteEventHandler)
			}
		}
		v1.GET("/p/:publicID", a.getPublicTimelineByPublicIDHandler)
	}

	return r
}

func (a *application) start() error {
	server := &http.Server{
		Addr:         a.config.addr,
		Handler:      a.initRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  time.Second * 10,
		WriteTimeout: time.Second * 30,
	}

	shutdownChan := make(chan error)

	go func() {
		osSigChan := make(chan os.Signal, 1)
		signal.Notify(osSigChan, syscall.SIGINT, syscall.SIGTERM)

		s := <-osSigChan
		log.Printf("server shutdown initiated by %s", s.String())

		ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
		defer cancel()

		shutdownChan <- server.Shutdown(ctx)
	}()

	log.Printf("server will listen on %s\n", a.config.addr)

	err := server.ListenAndServe()
	if err != nil && !errors.Is(err, http.ErrServerClosed) {
		return err
	}

	err = <-shutdownChan
	if err != nil {
		return err
	}

	log.Println("server has stopped")

	return nil
}
