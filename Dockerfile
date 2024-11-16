# Stage 1: Build the Nuxt 3 project
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install dependencies for Nuxt 3
RUN npm install

# Copy the entire project
COPY . .

# Build the Nuxt 3 app
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine

WORKDIR /app

# Copy the Nuxt app and Express API from the build stage
COPY --from=build /app /app

# Copy .env for Express API
COPY ./api/.env ./api/.env

# Install dependencies for Express API (inside the `api` folder)
WORKDIR /app/api
RUN npm install --production

# Set environment variable for API URL (if necessary for Nuxt or Express)
# ENV VITE_API_URL="http://localhost:5000/api"  # You can pass this if needed

# Expose necessary ports
EXPOSE 3000 5000

# Command to run both Nuxt 3 and Express API
CMD ["sh", "-c", "npm run start & npm run start-api"]
