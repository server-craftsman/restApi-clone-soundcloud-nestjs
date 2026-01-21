import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { AuthFacebookController } from './auth-facebook.controller';
import { AuthFacebookService } from './auth-facebook.service';

@Module({
  imports: [ConfigModule, PassportModule.register({ session: false }), AuthModule, UsersModule],
  controllers: [AuthFacebookController],
  providers: [FacebookStrategy, FacebookAuthGuard, AuthFacebookService],
  exports: [FacebookAuthGuard],
})
export class AuthFacebookModule {}
