# Use an official Node.js runtime as a parent image
FROM node:16-alpine AS build-stage

# Set the working directory in the container
WORKDIR /app

# Copy the entire project directory
COPY . .

# Make sure the script is executable
RUN chmod +x /app/site-build.sh

# Install bash
RUN apk add --no-cache bash

# Modify npm install command in site-build.sh to use --legacy-peer-deps
RUN sed -i 's/npm ci/npm ci --legacy-peer-deps/g' /app/site-build.sh
RUN sed -i 's/npm install/npm install --legacy-peer-deps/g' /app/site-build.sh

# Run the build script
RUN /bin/bash /app/site-build.sh

# Use a second stage with a smaller image for serving the app
FROM nginx:stable-alpine

# Copy the build output to the nginx html directory
COPY --from=build-stage /app/site/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]