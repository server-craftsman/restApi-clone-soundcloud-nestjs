import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async signUp(@Body() dto: SignUpDto): Promise<AuthResponseDto> {
    const { user, accessToken } = await this.authService.signUp(dto);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  @Post('sign-in')
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async signIn(@Body() dto: SignInDto): Promise<AuthResponseDto> {
    const { user, accessToken } = await this.authService.signIn(dto);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
