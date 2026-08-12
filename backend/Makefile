.PHONY: fmt lint test build run dev migrate-up migrate-down get-env test-get-env

fmt:
	@go fmt ./...

test:
	@go test ./...

test-race:
	@go test -race ./...

lint:
	@golangci-lint run

lint-fix:
	@golangci-lint run --fix

lint-q:
	@golangci-lint run --new-from-rev=HEAD~1

build: fmt test lint
	@go build -o ./dist/bin ./cmd/api

build-force:
	@go build -o ./dist/bin ./cmd/api

run:
	@go run ./cmd/api

dev:
	@air

# helper command for secret retrieval
get-env:
	@if [ -z "$(KEY)" ]; then echo "KEY is required" >&2; exit 1; fi
	@VAL=$$(grep -m 1 -F "$(KEY)" .env | cut -d= -f2-); \
	if [ -z "$$VAL" ]; then echo "missing key: $(KEY)" >&2; exit 1; fi; \
	echo "$$VAL"

# test command for get-env
test-get-env:
	@SOMEVAL="$$($(MAKE) -s get-env KEY=TEST_VAR)"; \
	echo "value is: "$$SOMEVAL""

migrate-up:
	@DB_ADDR=$$($(MAKE) -s get-env KEY=DATABASE_URL); \
	migrate -path=./cmd/migrate/migrations -database="$$DB_ADDR" up

migrate-down:
	@DB_ADDR=$$($(MAKE) -s get-env KEY=DATABASE_URL); \
	migrate -path=./cmd/migrate/migrations -database="$$DB_ADDR" down