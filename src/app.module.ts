import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, envValidationSchema } from './config';
import { DatabaseModule } from './database';
import { StorageModule } from './storage';
import { TracksModule } from './tracks';
import { QueueModule } from './queue';
import { MediaModule } from './media';
import { HomeModule } from './home';
import { UsersModule } from './users';
import { AuthModule } from './auth';
import { AuthGoogleModule } from './auth-google';
import { AuthFacebookModule } from './auth-facebook';
import { MailModule } from './mail';
import { MailerModule } from './mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    DatabaseModule,
    QueueModule,
    StorageModule,
    MailerModule,
    UsersModule,
    AuthModule,
    AuthGoogleModule,
    AuthFacebookModule,
    MailModule,
    TracksModule,
    MediaModule,
    HomeModule,
  ],
})
export class AppModule {}
