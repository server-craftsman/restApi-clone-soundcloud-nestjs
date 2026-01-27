import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { User } from '../users/domain/user';

@ApiTags('Auth - OAuth')
@Controller('auth/oauth/google')
export class AuthGoogleController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Initiate Google OAuth login',
    description:
      'MUST be opened in browser tab, NOT via Swagger Execute button. Copy URL and paste in browser address bar.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Google OAuth consent screen',
  })
  @ApiResponse({
    status: 400,
    description: 'Do not call via AJAX/fetch - use browser navigation only',
  })
  async googleAuth() {
    // Passport guard handles redirect automatically
    // This should never be reached as guard redirects first
  }

  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT access token and user info',
    schema: {
      type: 'object',
      properties: {
        user: { type: 'object' },
        accessToken: { type: 'string' },
      },
    },
  })
  googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const accessToken = this.authService.createAccessToken(user);

    // Return JSON response
    return res.json({ user, accessToken });
  }
}
