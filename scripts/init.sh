cp review-service/.env.example review-service/.env; \
cp prestation-service/.env.example prestation-service/.env;  \
docker compose up -d --build; \
sh scripts/migrate.sh