package main

import (
	"log"

	"github.com/mrtnstl/timelines/internal/db"
	"github.com/mrtnstl/timelines/internal/store"
	"github.com/mrtnstl/timelines/internal/utils/env"
)

func main() {
	conf := config{
		addr:        env.GetStr("ADDR", "0.0.0.0:8080"),
		frontendURL: env.GetStr("FRONTEND_URL", "0.0.0.0:5173"),
		dbConf: dbConfig{
			addr:         env.GetStr("DATABASE_URL", "postgres://user:password@localhost/dbname"),
			maxIdleTime:  "15m",
			maxOpenConns: 30,
			maxIdleConns: 30,
		},
	}

	db, err := db.New(
		conf.dbConf.addr,
		conf.dbConf.maxIdleTime,
		conf.dbConf.maxOpenConns,
		conf.dbConf.maxIdleConns,
	)
	if err != nil {
		panic(err)
	}
	defer func() {
		log.Fatal(db.Close())
	}()

	store := store.NewStore(db)

	app := &application{
		config: conf,
		store:  *store,
	}

	r := app.init()

	log.Printf("Server will listen on %s\n", conf.addr)
	log.Fatal(app.start(r))
}
