package cache

import (
	"time"

	"github.com/redis/go-redis/v9"
)

func NewRedisClient(addr, password string) *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:               addr,
		Password:           password,
		DB:                 0,
		DialerRetries:      5,
		DialerRetryBackoff: redis.DialRetryBackoffExponential(time.Millisecond*100, time.Second*2),
	})
}
