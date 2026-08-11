package main

type config struct {
	addr        string
	frontendURL string
	dbConf      dbConfig
	redisConf   redisConfig
}

type dbConfig struct {
	addr         string
	maxIdleTime  string
	maxOpenConns int
	maxIdleConns int
}

type redisConfig struct {
	addr     string
	username string
	password string
}
