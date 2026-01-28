import ffmpegStatic from 'ffmpeg-static';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import { FfprobeInstaller } from './interfaces';

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProduction = nodeEnv === 'production';

const getEnv = (key: string, fallback?: string) =>
  process.env[key] !== undefined ? process.env[key] : fallback;

const getNumber = (key: string, fallback: number) => {
  const value = process.env[key];
  if (value === undefined) return fallback;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const getDatabaseConfig = () => ({
  host: getEnv('POSTGRES_HOST', '127.0.0.1'),
  port: getNumber('POSTGRES_PORT', 5432),
  username: getEnv('POSTGRES_USER', 'soundcloud_user'),
  password: getEnv('POSTGRES_PASSWORD', 'soundcloud_password'),
  database: getEnv('POSTGRES_DB', 'soundcloud_db'),
  ssl:
    getEnv('POSTGRES_SSL') === 'true' ? { rejectUnauthorized: false } : false,
});

export default () => ({
  nodeEnv,
  port: parseInt(process.env.PORT ?? '3000', 10),
  app: {
    title: 'SoundCloud Clone API',
    version: '1.0.0',
  },
  api: {
    prefix: getEnv('API_PREFIX', 'api'),
    version: getEnv('API_VERSION', 'v1'),
  },
  database: getDatabaseConfig(),
  redis: {
    host: getEnv('REDIS_HOST', '127.0.0.1'),
    port: getNumber('REDIS_PORT', 6379),
    password: getEnv('REDIS_PASSWORD', ''),
  },
  storage: isProduction
    ? {
        type: 's3',
        region: getEnv('AWS_REGION'),
        accessKeyId: getEnv('AWS_ACCESS_KEY_ID'),
        secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY'),
        bucket: getEnv('AWS_S3_BUCKET'),
      }
    : {
        type: 'minio',
        endPoint: getEnv('MINIO_ENDPOINT', 'localhost'),
        port: getNumber('MINIO_PORT', 9000),
        accessKey: getEnv('MINIO_ACCESS_KEY', 'minioadmin'),
        secretKey: getEnv('MINIO_SECRET_KEY', 'minioadmin'),
        useSSL: (getEnv('MINIO_USE_SSL', 'false') ?? 'false') === 'true',
        bucket: getEnv('MINIO_BUCKET', 'tracks'),
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
      clientId: getEnv('GOOGLE_CLIENT_ID', 'dev-google-client-id'),
      clientSecret: getEnv('GOOGLE_CLIENT_SECRET', 'dev-google-client-secret'),
      callbackURL: getEnv(
        'GOOGLE_CALLBACK_URL',
        'http://localhost:3000/auth/google/callback',
      ),
    },
    facebook: {
      appId: getEnv('FACEBOOK_APP_ID', 'dev-facebook-app-id'),
      appSecret: getEnv('FACEBOOK_APP_SECRET', 'dev-facebook-app-secret'),
      callbackURL: getEnv(
        'FACEBOOK_CALLBACK_URL',
        'http://localhost:3000/auth/facebook/callback',
      ),
    },
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) ?? [
      'http://localhost:3000',
    ],
  },
});
