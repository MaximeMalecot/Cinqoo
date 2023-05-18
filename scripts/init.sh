cp auth-service/.env.example auth-service/.env; \
cp gateway-service/.env.example gateway-service/.env; \
cp prestation-service/.env.example prestation-service/.env;  \
cp review-service/.env.example review-service/.env; \
cp user-service/.env.example user-service/.env;  \
docker compose up -d --build; \
sleep 10; \
sh scripts/migrate.sh; \
docker compose restart prestation-service review-service user-service;