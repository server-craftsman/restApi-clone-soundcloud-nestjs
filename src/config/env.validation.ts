import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  POSTGRES_HOST: Joi.string().default('127.0.0.1'),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  REDIS_HOST: Joi.string().default('127.0.0.1'),
  REDIS_PORT: Joi.number().default(6379),
  MINIO_ENDPOINT: Joi.string().default('127.0.0.1'),
  MINIO_PORT: Joi.number().default(9000),
  MINIO_ACCESS_KEY: Joi.string().required(),
  MINIO_SECRET_KEY: Joi.string().required(),
  MINIO_BUCKET: Joi.string().default('tracks'),
  MINIO_USE_SSL: Joi.boolean().default(false),
  FFMPEG_PATH: Joi.string().optional(),
  FFPROBE_PATH: Joi.string().optional(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
  FACEBOOK_APP_ID: Joi.string().required(),
  FACEBOOK_APP_SECRET: Joi.string().required(),
  FACEBOOK_CALLBACK_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  CORS_ORIGIN: Joi.string().default(
    'http://localhost:3000,http://localhost:8888',
  ),
  UPLOAD_FREE_MINUTES: Joi.number().positive().default(180),
  UPLOAD_PRO_MINUTES: Joi.number().min(0).default(0),
  UPLOAD_MAX_FILE_SIZE_BYTES: Joi.number()
    .positive()
    .default(4 * 1024 * 1024 * 1024),
});
