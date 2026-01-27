import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  // Database (defaults for development)
  POSTGRES_HOST: Joi.string().default('127.0.0.1'),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_USER: Joi.string().default('soundcloud_user'),
  POSTGRES_PASSWORD: Joi.string().default('soundcloud_password'),
  POSTGRES_DB: Joi.string().default('soundcloud_db'),
  POSTGRES_SSL: Joi.boolean().default(false),
  // Redis (defaults for development)
  REDIS_HOST: Joi.string().default('127.0.0.1'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  // MinIO (development)
  MINIO_ENDPOINT: Joi.string().default('127.0.0.1'),
  MINIO_PORT: Joi.number().default(9000),
  MINIO_ACCESS_KEY: Joi.string().default('minioadmin'),
  MINIO_SECRET_KEY: Joi.string().default('minioadmin'),
  MINIO_BUCKET: Joi.string().default('tracks'),
  MINIO_USE_SSL: Joi.boolean().default(false),
  // AWS S3 (production)
  AWS_REGION: Joi.string().allow('').optional(),
  AWS_ACCESS_KEY_ID: Joi.string().allow('').optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().allow('').optional(),
  AWS_S3_BUCKET: Joi.string().allow('').optional(),
  FFMPEG_PATH: Joi.string().allow('').optional(),
  FFPROBE_PATH: Joi.string().allow('').optional(),
  // OAuth: required in production, defaults in development
  GOOGLE_CLIENT_ID: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.string()
      .allow('')
      .optional()
      .default('dev-google-client-id'),
  }),
  GOOGLE_CLIENT_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.string()
      .allow('')
      .optional()
      .default('dev-google-client-secret'),
  }),
  GOOGLE_CALLBACK_URL: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.string()
      .allow('')
      .optional()
      .default('http://localhost:8888/auth/google/callback'),
  }),
  FACEBOOK_APP_ID: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.string().allow('').optional().default('dev-facebook-app-id'),
  }),
  FACEBOOK_APP_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.string()
      .allow('')
      .optional()
      .default('dev-facebook-app-secret'),
  }),
  FACEBOOK_CALLBACK_URL: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.string()
      .allow('')
      .optional()
      .default('http://localhost:8888/auth/facebook/callback'),
  }),
  // JWT: required in production, default in development
  JWT_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.string().allow('').optional().default('dev_jwt_secret'),
  }),
  CORS_ORIGIN: Joi.string().default(
    'http://localhost:8888,http://localhost:8888',
  ),
  UPLOAD_FREE_MINUTES: Joi.number().positive().default(180),
  UPLOAD_PRO_MINUTES: Joi.number().min(0).default(0),
  UPLOAD_MAX_FILE_SIZE_BYTES: Joi.number()
    .positive()
    .default(4 * 1024 * 1024 * 1024),
});
