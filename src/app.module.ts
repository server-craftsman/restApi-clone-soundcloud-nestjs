import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, envValidationSchema } from './config';
import { DatabaseModule } from './database';
import { StorageModule } from './storage';
import { TracksModule } from './tracks';
import { QueueModule } from './queue';
import { MediaModule } from './media';
import { HomeModule } from './home';

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
    TracksModule,
    MediaModule,
    HomeModule,
  ],
})
export class AppModule {}
