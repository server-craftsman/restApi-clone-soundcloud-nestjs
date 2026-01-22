import ffmpegStatic from 'ffmpeg-static';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

interface FfprobeInstaller {
  path?: string;
}

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
    ffmpegPath:
      process.env.FFMPEG_PATH ??
      (typeof ffmpegStatic === 'string' ? ffmpegStatic : undefined),
    ffprobePath:
      process.env.FFPROBE_PATH ??
      (ffprobeInstaller as FfprobeInstaller | undefined)?.path,
  },
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    facebook: {
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET,
      callbackUrl: process.env.FACEBOOK_CALLBACK_URL,
    },
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) ?? [
      'http://localhost:3000',
    ],
  },
});
