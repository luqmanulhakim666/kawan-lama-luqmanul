# Nuxt Minimal Starter

## Setup Frontend

npm install
touch .env

## env variables

VITE_API_URL = "http://localhost:5000/api"

## Run Project

npm run dev

## Setup API

cd api
npm install
npx prisma migrate dev --name init

touch .env

## env variables

DATABASE_URL="mysql://root:@localhost:3306/todo_app" // adjust the host
JWT_SECRET="secret"
PORT=5000

## Run Project

npx ts-node src/server.ts
