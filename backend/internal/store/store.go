package store

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

var (
	QueryTimeoutDuration = time.Second * 5
	ErrNotFound          = errors.New("record not found")
)

type Store struct {
	Timelines interface {
		Create(context.Context, *Timeline) error
		GetByID(context.Context, string, string) (Timeline, error)
		GetByOwnerID(context.Context, string) ([]Timeline, error)
		Update(context.Context, *Timeline) error
		SoftDelete(context.Context, string) error
		GetSoftDeleted(context.Context, string) ([]Timeline, error)
		HardDelete(context.Context, string) error
		GetPublishedByPublicID(context.Context, string) (Timeline, error)
	}
	TimelineEvents interface {
		Create(context.Context, *TimelineEvent) error
		GetByID(context.Context, string) (TimelineEvent, error)
		GetByTimelineID(context.Context, string) ([]TimelineEvent, error)
		Update(context.Context, *TimelineEvent, string) error
		Delete(context.Context, string, string) error
		GetLargestSerial(context.Context, string) (int, error)
	}
	Users interface{}
}

func NewStore(db *sql.DB) *Store {
	return &Store{
		Timelines:      &TimelineStore{db},
		TimelineEvents: &TimelineEventStore{db},
	}
}
