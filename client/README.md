# Redis shopping cart UI

## Development

```
# Environmental variables

Copy `.env.example` to `.env` file and fill environmental variables

-   VUE_APP_API_URL: Backend API URL (default: http://localhost:3000)


# Run docker compose or install redis with RedisJson module manually

docker network create global
docker-compose up -d --build


# Install dependencies

npm cache clean && npm install

# Serve locally

npm run serve
```
