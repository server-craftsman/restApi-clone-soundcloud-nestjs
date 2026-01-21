import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const subject = 'Welcome to SoundCloud Clone';
    const html = `
      <h1>Welcome, ${firstName}!</h1>
      <p>Thank you for joining our platform.</p>
      <p>Start uploading your favorite music and sharing it with the world.</p>
      <a href="${process.env.APP_URL}/login">Login to your account</a>
    `;

    await this.mailerService.sendMail(email, subject, html);
    this.logger.log(`Welcome email sent to ${email}`);
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    const subject = 'Password Reset Request';
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
    const html = `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `;

    await this.mailerService.sendMail(email, subject, html);
    this.logger.log(`Password reset email sent to ${email}`);
  }

  async sendEmailVerificationEmail(
    email: string,
    verificationToken: string,
  ): Promise<void> {
    const subject = 'Verify Your Email';
    const verifyUrl = `${process.env.APP_URL}/verify-email?token=${verificationToken}`;
    const html = `
      <h1>Email Verification</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;

    await this.mailerService.sendMail(email, subject, html);
    this.logger.log(`Email verification sent to ${email}`);
  }
}
