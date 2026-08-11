package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/mrtnstl/timelines/internal/cache"
	"github.com/mrtnstl/timelines/internal/db"
	"github.com/mrtnstl/timelines/internal/store"
	"github.com/mrtnstl/timelines/internal/utils/env"

	_ "github.com/joho/godotenv"
)

func main() {
	gin.SetMode(gin.ReleaseMode)

	conf := config{
		addr:        env.GetStr("ADDR", "0.0.0.0:8080"),
		frontendURL: env.GetStr("FRONTEND_URL", "0.0.0.0:5173"),
		dbConf: dbConfig{
			addr:         env.GetStr("DATABASE_URL", "postgres://user:password@localhost/dbname"),
			maxIdleTime:  "15m",
			maxOpenConns: 30,
			maxIdleConns: 30,
		},
		redisConf: redisConfig{
			addr:     env.GetStr("REDIS_URL", "localhost"),
			username: env.GetStr("REDIS_USER", "user"),
			password: env.GetStr("REDIS_PW", "password"),
		},
	}

	db, err := db.New(
		conf.dbConf.addr,
		conf.dbConf.maxIdleTime,
		conf.dbConf.maxOpenConns,
		conf.dbConf.maxIdleConns,
	)
	if err != nil {
		//panic(err)
		log.Println(err)
	}
	defer func() {
		//log.Fatal(db.Close())
	}()

	store := store.NewStore(db)

	redis := cache.NewRedisClient(
		conf.redisConf.addr,
		conf.redisConf.username,
		conf.redisConf.password,
	)
	defer func() {
		//log.Fatal(redis.Close())
	}()

	cacheStore := cache.NewRedisStore(redis)

	app := &application{
		config: conf,
		store:  *store,
		cache:  *cacheStore,
	}

	if err := app.start(); err != nil {
		log.Fatal(err)
	}
}
