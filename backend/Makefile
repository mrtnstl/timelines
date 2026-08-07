.PHONY: fmt lint test build

fmt:
	go fmt ./...

test:
	go test ./...

test-race:
	go test -race ./...

lint:
	golangci-lint run

lint-fix:
	golangci-lint run --fix

lint-q:
	golangci-lint run --new-from-rev=HEAD~1

build: fmt test lint
	go build -o ./dist/bin ./cmd/main.go

build-force:
	go build -o ./dist/bin ./cmd/main.go

