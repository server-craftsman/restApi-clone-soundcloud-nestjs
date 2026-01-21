# SoundCloud Clone REST API

Backend REST API for a SoundCloud-like audio streaming platform built with NestJS, PostgreSQL, MinIO, and Redis.

## Features

- **Audio Upload**: Multipart file upload with metadata (title, description)
- **HTTP Range Streaming**: Partial content streaming (206) for efficient audio playback
- **Background Transcoding**: Async conversion to MP3 using ffmpeg via BullMQ
- **Cloud Storage**: MinIO (S3-compatible) for scalable audio storage
- **TypeORM**: PostgreSQL integration with auto-migrations

## Architecture

### Clean Architecture Layers

1. **Infrastructure**
   - [src/config](src/config): Environment validation & typed configuration
   - [src/database](src/database): TypeORM module wiring
   - [src/storage](src/storage): MinIO adapter service
   - [src/queue](src/queue): BullMQ Redis queue setup

2. **Domain**
   - [src/tracks/entities](src/tracks/entities): Track entity with status enum

3. **Application**
   - [src/tracks](src/tracks): Tracks module (controller, service, DTOs)
   - [src/media](src/media): Media processor for async ffmpeg jobs

4. **Presentation**
   - [src/tracks/tracks.controller.ts](src/tracks/tracks.controller.ts): Upload & stream endpoints

## Tech Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL (via TypeORM)
- **Cache/Queue**: Redis (via BullMQ)
- **Storage**: MinIO (S3-compatible)
- **Media**: ffmpeg (via fluent-ffmpeg + ffmpeg-static)
- **Validation**: class-validator + class-transformer

## Prerequisites

- Node.js 18+
- Docker & Docker Compose (for Postgres, Redis, MinIO)

## Setup

1. **Install dependencies**

   ```bash
   yarn install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Start infrastructure** (Docker Compose recommended)

   ```bash
   docker compose up -d postgres redis minio
   ```

   Or manually:
   - PostgreSQL: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=soundcloud123 -e POSTGRES_DB=soundcloud postgres:16`
   - Redis: `docker run -d -p 6379:6379 redis:7`
   - MinIO: `docker run -d -p 9000:9000 -p 9001:9001 -e MINIO_ROOT_USER=minioadmin -e MINIO_ROOT_PASSWORD=minioadmin minio/minio server /data --console-address ":9001"`

4. **Run migrations** (TypeORM auto-sync enabled in dev)
   ```bash
   yarn start:dev
   ```

## API Endpoints

### Upload Track

```bash
POST /tracks
Content-Type: multipart/form-data

Form fields:
- file: audio file (max 100MB)
- title: string
- description: string (optional)
```

### Stream Track

```bash
GET /tracks/:id/stream
Headers:
- Range: bytes=0-1023 (optional, for partial content)

Response:
- 200 OK (full content)
- 206 Partial Content (range request)
```

## Development

```bash
# Development with watch mode
yarn start:dev

# Build
yarn build

# Production
yarn start:prod

# Tests
yarn test
yarn test:e2e
```

## Project Structure

```
src/
├── config/               # Environment validation & config loader
│   ├── configuration.ts
│   └── env.validation.ts
├── database/             # TypeORM module
│   └── database.module.ts
├── storage/              # MinIO adapter
│   ├── storage.module.ts
│   └── storage.service.ts
├── queue/                # BullMQ setup
│   ├── queue.module.ts
│   └── queue.constants.ts
├── tracks/               # Tracks domain
│   ├── entities/
│   │   └── track.entity.ts
│   ├── dto/
│   │   └── create-track.dto.ts
│   ├── tracks.controller.ts
│   ├── tracks.service.ts
│   └── tracks.module.ts
├── media/                # Background processing
│   ├── media.processor.ts
│   └── media.module.ts
├── app.module.ts
└── main.ts
```

## Next Steps

- [ ] Add authentication (JWT)
- [ ] Add users/profiles module
- [ ] Implement playlists
- [ ] Add comments & likes
- [ ] Implement search & discovery
- [ ] Add waveform generation
- [ ] Implement social features (follows, feed)
- [ ] Add admin/moderation tools
- [ ] Deploy to production (AWS/GCP)

## License

UNLICENSED
