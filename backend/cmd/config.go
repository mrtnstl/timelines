package main

type config struct {
	addr        string
	frontendURL string
	dbConf      dbConfig
}

type dbConfig struct {
	addr         string
	maxIdleTime  string
	maxOpenConns int
	maxIdleConns int
}
