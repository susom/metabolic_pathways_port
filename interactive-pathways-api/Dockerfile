# Build stage
FROM golang:1.18 AS build

WORKDIR /app

COPY api/go.mod api/go.sum ./
RUN go mod download

COPY api/ .

RUN go build -o main ./svgConvert/main.go

# Final stage: use Debian slim image
FROM debian:bullseye-slim

WORKDIR /root/
COPY --from=build /app/main .

# Install rsvg-convert
RUN apt-get update && apt-get install -y librsvg2-bin

# Expose the port on which the application will run
EXPOSE 8080

CMD ["./main"]
