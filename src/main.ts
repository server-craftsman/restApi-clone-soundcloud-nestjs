import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Enable CORS with allowed origins from config
  const allowedOrigins = configService.get<string[]>('cors.origin');
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  
  const port = process.env.PORT ?? 3000;
  
  const config = new DocumentBuilder()
    .setTitle('SoundCloud Clone API')
    .setDescription('REST API documentation')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${port}`, 'Local Development')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  
  await app.listen(port);
}
bootstrap();
