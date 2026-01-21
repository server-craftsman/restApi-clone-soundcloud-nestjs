// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpegStatic = require('ffmpeg-static');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');

export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  app: {
    title: 'SoundCloud Clone API',
    version: '1.0.0',
  },
  database: {
    host: process.env.POSTGRES_HOST ?? '127.0.0.1',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
  },
  redis: {
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  },
  storage: {
    endPoint: process.env.MINIO_ENDPOINT ?? '127.0.0.1',
    port: parseInt(process.env.MINIO_PORT ?? '9000', 10),
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    useSSL: (process.env.MINIO_USE_SSL ?? 'false') === 'true',
    bucket: process.env.MINIO_BUCKET ?? 'tracks',
  },
  media: {
    ffmpegPath: process.env.FFMPEG_PATH ?? ffmpegStatic ?? undefined,
    ffprobePath: process.env.FFPROBE_PATH ?? ffprobeInstaller?.path ?? undefined,
  },
});
