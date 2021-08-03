# Example For Simple Task Management App

This is an example of simple application for daily task management, build by Nuxtjs, Nestjs and mongodb

## Install App
---
Nodejs, docker and docker-compose must be installed in your computer

Install all package in both frontend and backend

```sh
sh install.sh
```

Or
```sh
# installing frontend 

cd ./frontend_nuxt
npm install

# installing backend 

cd ../backend_nestjs_mongodb_elastic
npm install
```

## Run App
---
```sh
# Run database
cd ./backend_nestjs_mongodb_elastic/mongo-local
docker compose up -d

# Run backend
cd ./backend_nestjs_mongodb_elastic
npm run start:dev

# Run frontend
cd ./frontend_nuxt
npm run dev
```

## App Structure 
---
1. Frontend `Nuxtjs`

2. Backend `Nestjs with GraphqlAPI`

3. Database `MongoDB and Elasticsearch`


## Functionalities
1. Authentication
   1. Register new account
   2. Login to account
   3. Logout
2. Task Management
   1. Drag and drop task list
   2. CRUD
   3. Realtime pubsub

