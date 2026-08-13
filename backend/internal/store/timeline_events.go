package store

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

type TimelineEvent struct {
	ID          string    `json:"id"`
	TimelineID  string    `json:"timeline_id"`
	Title       string    `json:"title"`
	Date        string    `json:"date"`
	Description string    `json:"description"`
	Image       *string   `json:"image"` // nullable
	Serial      int       `json:"serial"`
	Version     int       `json:"version"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type TimelineEventStore struct {
	db *sql.DB
}

func (s *TimelineEventStore) Create(ctx context.Context, timelineEvent *TimelineEvent) error {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := s.db.QueryRowContext(
		ctx,
		`INSERT INTO timeline_events (timeline_id, title, date, description, image, serial)
		values ($1, $2, $3, $4, $5, $6) RETURNING id, version, created_at, updated_at;`,
		timelineEvent.TimelineID,
		timelineEvent.Title,
		timelineEvent.Date,
		timelineEvent.Description,
		timelineEvent.Image,
		timelineEvent.Serial,
	).Scan(
		&timelineEvent.ID,
		&timelineEvent.Version,
		&timelineEvent.CreatedAt,
		&timelineEvent.UpdatedAt,
	)
	if err != nil {
		return err
	}

	return nil
}

func (s *TimelineEventStore) GetByID(ctx context.Context, id string) (TimelineEvent, error) {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var timelineEvent TimelineEvent
	err := s.db.QueryRowContext(
		ctx,
		`SELECT id, timeline_id, title, date, description, image, serial, version, created_at, updated_at FROM timeline_events
		WHERE id = $1;`,
		id,
	).Scan(
		&timelineEvent.ID,
		&timelineEvent.TimelineID,
		&timelineEvent.Title,
		&timelineEvent.Date,
		&timelineEvent.Description,
		&timelineEvent.Image,
		&timelineEvent.Serial,
		&timelineEvent.Version,
		&timelineEvent.CreatedAt,
		&timelineEvent.UpdatedAt,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return TimelineEvent{}, ErrNotFound
		default:
			return TimelineEvent{}, err
		}
	}

	return timelineEvent, nil
}

func (s *TimelineEventStore) GetByTimelineID(ctx context.Context, timelineID string) (timelineEvents []TimelineEvent, err error) {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	rows, err := s.db.QueryContext(
		ctx,
		`SELECT id, timeline_id, title, date, description, image, serial, version, created_at, updated_at FROM timeline_events
		WHERE timeline_id = $1;`,
		timelineID,
	)
	if err != nil {
		return nil, err
	}
	defer func() {
		rowsErr := rows.Close()
		if rowsErr != nil {
			if err != nil {
				err = errors.Join(err, rowsErr)
			} else {
				err = rowsErr
			}
		}
	}()

	for rows.Next() {
		var te TimelineEvent
		err := rows.Scan(
			&te.ID,
			&te.TimelineID,
			&te.Title,
			&te.Date,
			&te.Description,
			&te.Image,
			&te.Serial,
			&te.Version,
			&te.CreatedAt,
			&te.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		timelineEvents = append(timelineEvents, te)
	}

	return timelineEvents, nil
}

func (s *TimelineEventStore) Update(ctx context.Context, timelineEvent *TimelineEvent, ownerID string) error {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := s.db.QueryRowContext(
		ctx,
		`UPDATE timeline_events 
		SET title = $1, date = $2, description = $3, image = $4, 
		serial = $5, version = version + 1, updated_at = NOW()
		WHERE id = $6 AND timeline_id = $7 AND version = $8 AND timeline_id IN (SELECT id FROM timelines WHERE owner_id = $9)
		RETURNING version;`,
		timelineEvent.Title,
		timelineEvent.Date,
		timelineEvent.Description,
		timelineEvent.Image,
		timelineEvent.Serial,
		timelineEvent.ID,
		timelineEvent.TimelineID,
		timelineEvent.Version,
		ownerID,
	).Scan(
		&timelineEvent.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrNotFound
		default:
			return err
		}
	}

	return nil
}

func (s *TimelineEventStore) Delete(ctx context.Context, id, ownerID string) error {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	res, err := s.db.ExecContext(
		ctx,
		`DELETE FROM timeline_events 
		WHERE id = $1 AND timeline_id IN (SELECT id FROM timelines WHERE owner_id = $2);`,
		id,
		ownerID,
	)
	if err != nil {
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return ErrNotFound
	}

	return nil
}

func (s *TimelineEventStore) GetLargestSerial(ctx context.Context, timelineID string) (int, error) {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var largestSerial int
	err := s.db.QueryRowContext(
		ctx,
		`SELECT COALESCE(MAX(serial), 0) FROM timeline_events WHERE timeline_id = $1;`,
		timelineID,
	).Scan(
		&largestSerial,
	)
	if err != nil {
		return 0, nil
	}

	return largestSerial, nil
}
