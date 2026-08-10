package store

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

type Timeline struct {
	ID          string    `json:"id"`
	IsPublished bool      `json:"is_published"`
	OwnerID     string    `json:"owner_id"`
	PublicID    string    `json:"public_id"`
	Title       string    `json:"title"`
	Version     int64     `json:"version"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	DeletedAt   time.Time `json:"deleted_at"`
}

type TimelineStore struct {
	db *sql.DB
}

func (s *TimelineStore) Create(ctx context.Context, timeline *Timeline) error {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := s.db.QueryRowContext(
		ctx,
		`INSERT INTO timelines (owner_id, public_id, title)
		VALUES ($1, $2, $3, $4) RETURNING id, created_at, updated_at;`,
		timeline.OwnerID,
		timeline.PublicID,
		timeline.Title,
	).Scan(
		&timeline.ID,
		&timeline.CreatedAt,
		&timeline.UpdatedAt,
	)

	if err != nil {
		return err
	}

	return nil
}

func (s *TimelineStore) GetByID(ctx context.Context, id string) (Timeline, error) {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var timeline Timeline
	err := s.db.QueryRowContext(
		ctx,
		`SELECT id, is_published, owner_id, public_id, title, version, created_at, updated_at 
		FROM timelines WHERE id = $1 AND deleted_at IS NULL;`,
		id,
	).Scan(
		&timeline.ID,
		&timeline.IsPublished,
		&timeline.OwnerID,
		&timeline.PublicID,
		&timeline.Title,
		&timeline.Version,
		&timeline.CreatedAt,
		&timeline.UpdatedAt,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return Timeline{}, ErrNotFound
		default:
			return Timeline{}, err
		}
	}

	return timeline, nil
}

func (s *TimelineStore) GetByOwnerID(ctx context.Context, ownerID string) (timelines []Timeline, err error) {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	rows, err := s.db.QueryContext(
		ctx,
		`SELECT id, is_published, owner_id, public_id, title, version, created_at, updated_at 
		FROM timelines WHERE owner_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC;`,
		ownerID,
	)
	if err != nil {
		return nil, err
	}
	defer func() {
		err = rows.Close()
	}()

	for rows.Next() {
		var t Timeline
		err := rows.Scan(
			&t.ID,
			&t.IsPublished,
			&t.OwnerID,
			&t.PublicID,
			&t.Title,
			&t.Version,
			&t.CreatedAt,
			&t.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		timelines = append(timelines, t)
	}

	return timelines, nil
}

func (s *TimelineStore) Update(ctx context.Context, timeline *Timeline) error {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := s.db.QueryRowContext(
		ctx,
		`UPDATE timelines SET is_published = $1, title = $2, version = version + 1
		WHERE id = $3 AND version = $4
		RETURNING version;`,
		timeline.IsPublished,
		timeline.Title,
		timeline.ID,
		timeline.Version,
	).Scan(
		&timeline.Version,
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

func (s *TimelineStore) SoftDelete(ctx context.Context, id string) error {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	res, err := s.db.ExecContext(
		ctx,
		`UPDATE timelines SET deleted_at = NOW()
		WHERE id = $1;`,
		id,
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

func (s *TimelineStore) GetSoftDeleted(ctx context.Context, ownerID string) (timelines []Timeline, err error) {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	rows, err := s.db.QueryContext(
		ctx,
		`SELECT id, is_published, owner_id, public_id, title, version, created_at, updated_at, deleted_at 
		FROM timelines WHERE owner_id = $1 AND deleted_at NOT NULL
		ORDER BY created_at DESC;`,
		ownerID,
	)
	if err != nil {
		return nil, err
	}
	defer func() {
		err = rows.Close()
	}()

	for rows.Next() {
		var t Timeline
		err := rows.Scan(
			&t.ID,
			&t.IsPublished,
			&t.OwnerID,
			&t.PublicID,
			&t.Title,
			&t.Version,
			&t.CreatedAt,
			&t.UpdatedAt,
			&t.DeletedAt,
		)
		if err != nil {
			return nil, err
		}
		timelines = append(timelines, t)
	}

	return timelines, nil

}

func (s *TimelineStore) HardDelete(ctx context.Context, id string) error {
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	res, err := s.db.ExecContext(
		ctx,
		`DELETE FROM timelines
		WHERE id = $1;`,
		id,
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
