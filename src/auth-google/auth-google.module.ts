import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthGoogleController } from './auth-google.controller';
import { AuthGoogleService } from './auth-google.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ session: false }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AuthGoogleController],
  providers: [GoogleStrategy, GoogleAuthGuard, AuthGoogleService],
  exports: [GoogleAuthGuard],
})
export class AuthGoogleModule {}
