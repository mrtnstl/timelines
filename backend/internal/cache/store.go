package cache

import "github.com/redis/go-redis/v9"

type Store struct {
	TimelinesWithEvents interface{}
}

// TODO: !!!
func NewRedisStore(rdb *redis.Client) *Store {
	return &Store{
		TimelinesWithEvents: make(map[string]any),
	}
}
