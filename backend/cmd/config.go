package main

type Config struct {
	addr        string
	frontendURL string
	db          dbConfig
	cache       cacheConfig
}

type dbConfig struct{}

type cacheConfig struct{}
