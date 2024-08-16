FROM golang:1.18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum from the appropriate directory
COPY api/go.mod api/go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the application code from the correct directory
COPY api/ .

# Build the Go application
RUN go build -o main ./svgConvert/main.go

# Use a minimal image for running the Go application
FROM alpine:latest

WORKDIR /root/
COPY --from=build /app/main .

# Command to run the application
CMD ["./main"]
