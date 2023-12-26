docker-compose --env-file .env.production up -d
docker-compose --env-file .env.production down
docker-compose --env-file .env.production up --build
