import { Controller, Get, Query, Render } from '@nestjs/common';

@Controller('auth')
export class VerificationPageController {
  @Get('verify-email')
  @Render('verify-email')
  verifyEmailPage(@Query('token') token: string) {
    return {
      token,
      apiUrl: process.env.APP_URL || 'http://localhost:8888',
    };
  }

  @Get('email-verified')
  @Render('email-verified')
  emailVerifiedPage() {
    return {
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    };
  }

  @Get('verification-error')
  @Render('verification-error')
  verificationErrorPage(@Query('reason') reason?: string) {
    return {
      reason: reason || 'Unknown error',
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    };
  }
}