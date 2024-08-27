# Use an official Node.js runtime as a parent image
FROM node:16-alpine AS build-stage

# Set the working directory in the container
WORKDIR /app/site

# Install vim
RUN apk add --no-cache vim

# Copy package files and webpack configuration first (leverage Docker caching)
COPY site/package*.json ./
COPY site/webpack.config.js ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the project files
COPY site/ ./

# Set build arguments to environment variables (for webpack)
ARG REACT_APP_API_URL
ARG REACT_APP_SVG_ENDPOINT

# Run the build script with the build arguments
RUN REACT_APP_API_URL=$REACT_APP_API_URL REACT_APP_SVG_ENDPOINT=$REACT_APP_SVG_ENDPOINT npm run build

# Use a second stage with a smaller image for serving the app
FROM nginx:stable-alpine

# Set up the Nginx configuration to use the PORT environment variable
RUN echo "server { \
    listen 8080; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Copy the build output to the nginx html directory
COPY --from=build-stage /app/site/build /usr/share/nginx/html

# Expose the correct port
EXPOSE 8080

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
