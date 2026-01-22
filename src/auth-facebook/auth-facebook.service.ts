import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

interface OAuthProfile {
  id: string;
  emails?: Array<{ value: string }>;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  photos?: Array<{ value: string }>;
}

@Injectable()
export class AuthFacebookService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async generateTokenFromProfile(profile: OAuthProfile) {
    const user = await this.usersService.upsertSocialUser({
      provider: 'facebook',
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      avatar: profile.photos?.[0]?.value,
    });
    const accessToken = this.authService.createAccessToken(user);
    return { user, accessToken };
  }
}
