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
		GetByID(context.Context, string) (Timeline, error)
		GetByOwnerID(context.Context, string) ([]Timeline, error)
		Update(context.Context, *Timeline) error
		SoftDelete(context.Context, string) error
		GetSoftDeleted(context.Context, string) ([]Timeline, error)
		HardDelete(context.Context, string) error
	}
	TimelineEvents interface{}
	Users          interface{}
}

func NewStore(db *sql.DB) *Store {
	return &Store{
		Timelines: &TimelineStore{db},
	}
}
