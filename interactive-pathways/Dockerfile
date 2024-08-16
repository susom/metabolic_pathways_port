# Use an official Node.js runtime as a parent image
FROM node:16-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY site/package*.json ./

# Install any needed packages
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the container
COPY site/ .

# Build the application
RUN npm run build

# Use a second stage with a smaller image for serving the app
FROM nginx:stable-alpine

# Copy the build output to the nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
