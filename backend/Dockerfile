FROM golang:1.26.5-alpine AS builder

WORKDIR /build

COPY . .

RUN go mod download

RUN go build -o /dist/bin ./cmd/api

FROM scratch

WORKDIR /dist

COPY --from=builder /dist/bin /dist/bin

EXPOSE 8080

CMD ["/dist/bin"]