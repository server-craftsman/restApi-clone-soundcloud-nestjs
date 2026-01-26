# SoundCloud Clone REST API

## Requirements

- node --version: v20.0+
- npm --version: v9.6+
- yarn --version: 1.22+
- install node, npm or yarn
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

### Local Development

- yarn or npm install: install node_modules
- yarn dev or npm run dev: run src
- src run API in localhost: http://localhost:8888

### Docker

- docker compose up -d: start all services (postgres, redis, minio, app)
- docker compose down: stop all services
- docker compose down -v: stop and remove volumes
- docker compose logs -f app: view application logs
- docker compose ps: check running containers
- API runs on: http://localhost:8888
- API Docs run on: http://localhost:8888/swagger

## References

- [NestJS Documentation](https://docs.nestjs.com)
