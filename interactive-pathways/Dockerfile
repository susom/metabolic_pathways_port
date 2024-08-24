# Use an official Node.js runtime as a parent image
FROM node:16-alpine AS build-stage

# Set the working directory in the container
WORKDIR /app

# Install vim
RUN apk add --no-cache vim

# Copy the package files first (leverage Docker caching)
COPY site/package*.json ./site/

# Change directory to `site` before running npm ci
WORKDIR /app/site

# Install dependencies
RUN npm ci --legacy-peer-deps

# Return to the main app directory
WORKDIR /app

# Copy the rest of the project files
COPY . .

# Run the build script with sh
RUN chmod +x /app/site-build.sh && /bin/sh /app/site-build.sh

# Use a second stage with a smaller image for serving the app
FROM nginx:stable-alpine

# Copy the build output to the nginx html directory
COPY --from=build-stage /app/site/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
