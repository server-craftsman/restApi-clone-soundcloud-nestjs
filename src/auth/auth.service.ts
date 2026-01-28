import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { User } from '../users/domain/user';
import { EmailVerificationService } from './services/email-verification.service';
import { EmailVerificationStatus } from '../enums';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly refreshTokenExpirationDays: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {
    this.refreshTokenExpirationDays =
      this.configService.get<number>('REFRESH_TOKEN_EXPIRES_DAYS') || 7;
  }

  async signUp(dto: SignUpDto): Promise<{ user: User }> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verificationToken = this.generateVerificationToken();
    const verificationTokenExpiry =
      this.emailVerificationService.generateVerificationTokenExpiry();

    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
      emailVerificationStatus: EmailVerificationStatus.Pending,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiresAt: verificationTokenExpiry,
    });

    // Send verification email
    await this.emailVerificationService.sendVerificationEmail(
      user.email,
      verificationToken,
      user.firstName,
    );

    this.logger.log(`User registered: ${user.email}, verification email sent`);
    return { user };
  }

  async signIn(
    dto: SignInDto,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('User must sign up with password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is verified
    if (user.emailVerificationStatus !== EmailVerificationStatus.Verified) {
      throw new BadRequestException(
        'Please verify your email before signing in',
      );
    }

    const accessToken = this.createAccessToken(user);
    const refreshToken = this.generateRefreshToken(user.id);

    // TODO: Save refresh token to database
    // await this.refreshTokenRepository.create({ token: refreshToken, userId: user.id, expiresAt: ... });

    this.logger.log(`User signed in: ${user.email}`);
    return { user, accessToken, refreshToken };
  }

  async verifyEmail(
    dto: VerifyEmailDto,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // Find user by verification token
    const user = await this.usersService.findByEmailVerificationToken(
      dto.token,
    );
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (!user.emailVerificationTokenExpiresAt) {
      throw new BadRequestException('Verification token not found');
    }

    if (
      this.emailVerificationService.isTokenExpired(
        user.emailVerificationTokenExpiresAt,
      )
    ) {
      throw new BadRequestException('Verification token has expired');
    }

    // Mark email as verified
    const verifiedUser = await this.usersService.update(user.id, {
      emailVerificationStatus: EmailVerificationStatus.Verified,
      emailVerificationToken: null,
      emailVerificationTokenExpiresAt: null,
      isActive: true,
    });

    const accessToken = this.createAccessToken(verifiedUser);
    const refreshToken = this.generateRefreshToken(verifiedUser.id);

    this.logger.log(`Email verified: ${verifiedUser.email}`);
    return { user: verifiedUser, accessToken, refreshToken };
  }

  async refreshAccessToken(
    dto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // TODO: Validate refresh token from database
    // const refreshTokenRecord = await this.refreshTokenRepository.findOne(dto.refreshToken);
    // if (!refreshTokenRecord || refreshTokenRecord.isRevoked || isExpired(refreshTokenRecord)) {
    //   throw new UnauthorizedException('Invalid refresh token');
    // }

    // For now, just verify it's a valid JWT
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const user = await this.usersService.findById(payload.sub as string);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newAccessToken = this.createAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user.id);

      this.logger.log(`Access token refreshed for user: ${user.email}`);
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async resendVerificationEmail(
    dto: ResendVerificationDto,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if already verified
    if (user.emailVerificationStatus === EmailVerificationStatus.Verified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new verification token
    const verificationToken = this.generateVerificationToken();
    const verificationTokenExpiry =
      this.emailVerificationService.generateVerificationTokenExpiry();

    // Update user with new token
    await this.usersService.update(user.id, {
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiresAt: verificationTokenExpiry,
      emailVerificationStatus: EmailVerificationStatus.Pending,
    });

    // Send verification email
    await this.emailVerificationService.sendVerificationEmail(
      user.email,
      verificationToken,
      user.firstName,
    );

    this.logger.log(`Verification email resent to: ${user.email}`);
    return { message: 'Verification email sent successfully' };
  }

  createAccessToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        expiresIn: '15m',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );
  }

  private generateRefreshToken(userId: string): string {
    const expirationTime = new Date();
    expirationTime.setDate(
      expirationTime.getDate() + this.refreshTokenExpirationDays,
    );

    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(expirationTime.getTime() / 1000),
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  private generateVerificationToken(): string {
    return randomBytes(32).toString('hex');
  }
}
