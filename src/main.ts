import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as hbs from 'hbs';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();
  const configService = app.get(ConfigService);

  const allowedOrigins = configService.get<string[]>('cors.origin');
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Configure Handlebars template engine
  expressApp.set('views', join(process.cwd(), 'views'));
  expressApp.set('view engine', 'hbs');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = configService.get<number>('PORT') || 3000;

  const apiConfig = new DocumentBuilder()
    .setTitle('SoundCloud Clone API')
    .setDescription('REST API documentation')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${port}`, 'Local Development')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, apiConfig);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}

void bootstrap();
