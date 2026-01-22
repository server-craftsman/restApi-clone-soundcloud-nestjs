import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

    super({
      clientID: clientID ?? '',
      clientSecret: clientSecret ?? '',
      callbackURL: callbackURL ?? '',
      scope: ['email', 'profile'],
      passReqToCallback: false,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const email = profile.emails?.[0]?.value ?? null;
    const firstName =
      profile.name?.givenName ?? profile.displayName ?? 'Google';
    const lastName = profile.name?.familyName ?? '';
    const avatar = profile.photos?.[0]?.value ?? null;

    const user = await this.usersService.upsertSocialUser({
      provider: 'google',
      providerId: profile.id,
      email,
      firstName,
      lastName,
      avatar,
    });

    return user;
  }
}
