# Build stage
FROM node:14 as build
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY site/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY site ./

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]