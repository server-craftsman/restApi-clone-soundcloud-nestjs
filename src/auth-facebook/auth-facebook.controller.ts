import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';

@ApiTags('Auth Facebook')
@Controller('auth/facebook')
export class AuthFacebookController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ 
    summary: 'Initiate Facebook OAuth login',
    description: '⚠️ MUST be opened in browser tab, NOT via Swagger Execute button. Copy URL and paste in browser address bar.'
  })
  @ApiResponse({ status: 302, description: 'Redirects to Facebook OAuth consent screen' })
  @ApiResponse({ status: 400, description: 'Do not call via AJAX/fetch - use browser navigation only' })
  async facebookAuth(@Req() req: Request) {
    // Passport guard handles redirect automatically
    // This should never be reached as guard redirects first
  }

  @Get('callback')
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Facebook OAuth callback' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns JWT access token and user info',
    schema: {
      type: 'object',
      properties: {
        user: { type: 'object' },
        accessToken: { type: 'string' }
      }
    }
  })
  async facebookCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const accessToken = this.authService.createAccessToken(user);
    
    // Return JSON response
    return res.json({ user, accessToken });
  }
}
