import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email/register')
  @ApiResponse({ status: 201, type: AuthResponseDto, description: 'User registered successfully. Verification email sent.' })
  @ApiResponse({ status: 400, description: 'User already exists or validation error' })
  async register(@Body() dto: SignUpDto): Promise<AuthResponseDto> {
    const { user } = await this.authService.signUp(dto);
    return {
      message: 'Verification email sent. Please verify your email before signing in.',
    user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    } as unknown as AuthResponseDto;
  }

  @Post('email/login')
  @ApiResponse({ status: 200, type: AuthResponseDto, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or email not verified' })
  async login(@Body() dto: SignInDto): Promise<AuthResponseDto> {
    const { user, accessToken, refreshToken } = await this.authService.signIn(dto);
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  @Post('verify-email')
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({ status: 200, type: AuthResponseDto, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired verification token' })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<AuthResponseDto> {
    const { user, accessToken, refreshToken } = await this.authService.verifyEmail(dto);
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  @Post('refresh')
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'New access token and refresh token generated' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshAccessToken(dto);
  }
}
