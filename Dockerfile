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

# Copy only the necessary files from the build stage
COPY --from=build /app /app

# Install dependencies for Express API (inside the `api` folder)
WORKDIR /app/api
RUN npm install --production

# Expose necessary ports
EXPOSE 3000 4000

# Command to run both Nuxt 3 and Express API
CMD ["sh", "-c", "npm run start & npm run start-api"]
