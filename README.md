# SoundCloud Clone REST API

## Requirements

- node --version: v20.0+
- bun --version: v1.0+
- install node and bun
- create file .env with required fields:
  - NODE_ENV: development
  - PORT: 8888
  - APP_URL: http://localhost:8888
  - POSTGRES_HOST: localhost
  - POSTGRES_PORT: 5432
  - POSTGRES_USER: your_postgres_user
  - POSTGRES_PASSWORD: your_postgres_password
  - POSTGRES_DB: your_database_name
  - POSTGRES_SSL: false
  - REDIS_HOST: localhost
  - REDIS_PORT: 6379
  - REDIS_PASSWORD: your_redis_password (optional)
  - MINIO_ENDPOINT: localhost
  - MINIO_PORT: 9000
  - MINIO_ACCESS_KEY: minioadmin
  - MINIO_SECRET_KEY: minioadmin
  - MINIO_BUCKET: tracks
  - MINIO_USE_SSL: false
  - AWS_REGION: your_aws_region (optional)
  - AWS_ACCESS_KEY_ID: your_aws_key (optional)
  - AWS_SECRET_ACCESS_KEY: your_aws_secret (optional)
  - AWS_S3_BUCKET: your_s3_bucket (optional)
  - FFMPEG_PATH: (optional)
  - FFPROBE_PATH: (optional)
  - GOOGLE_CLIENT_ID: your_google_client_id (optional)
  - GOOGLE_CLIENT_SECRET: your_google_secret (optional)
  - GOOGLE_CALLBACK_URL: http://localhost:8888/auth/google/callback
  - FACEBOOK_APP_ID: your_facebook_app_id (optional)
  - FACEBOOK_APP_SECRET: your_facebook_secret (optional)
  - FACEBOOK_CALLBACK_URL: http://localhost:8888/auth/facebook/callback
  - JWT_SECRET: your_jwt_secret
  - CORS_ORIGIN: http://localhost:3000,http://localhost:8888
  - UPLOAD_FREE_MINUTES: 180
  - UPLOAD_PRO_MINUTES: 0
  - UPLOAD_MAX_FILE_SIZE_BYTES: 4294967296
  - SMTP_HOST: smtp.gmail.com (optional)
  - SMTP_PORT: 587 (optional)
  - SMTP_SECURE: true (optional)
  - SMTP_USER: your_email@gmail.com (optional)
  - SMTP_PASS: your_email_password (optional)
  - SMTP_FROM_EMAIL: YourApp <no-reply@yourapp.com> (optional)

## Running the project

### Docker (One file - Development & Production)

**Development - Start with hot reload:**

```bash
docker compose up
```

**Production - Build optimized image:**

```bash
docker compose up -d --build
```

**Commands:**

```bash
docker compose logs -f app        # View logs
docker compose restart app         # Restart app
docker compose down                # Stop all services
docker compose down -v             # Stop and remove volumes
```

**Access services:**

- API: http://localhost:8888
- MinIO Console: http://localhost:9001 (minioadmin/minioadmin)

### Migrations

- bun run migration:generate src/database/migrations/MigrationName: generate migration from entities
- bun run migration:create src/database/migrations/MigrationName: create empty migration
- bun run migration:run: run pending migrations
- bun run migration:revert: revert last migration
- bun run migration:show: show all migrations

## References

- [NestJS Documentation](https://docs.nestjs.com)
