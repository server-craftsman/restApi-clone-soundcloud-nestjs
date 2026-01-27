import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerService {
  private logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT');
    const secure = this.configService.get<string>('SMTP_SECURE') === 'true';
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!host || !user || !pass) {
      // Fallback to JSON transport in development when SMTP is not configured
      this.transporter = nodemailer.createTransport({ jsonTransport: true });
      this.logger.warn('SMTP env not set; using JSON transport for emails');
      return;
    }

    const smtpConfig: SMTPTransport.Options = {
      host,
      port,
      secure,
      auth: { user, pass },
    };

    this.transporter = nodemailer.createTransport(smtpConfig);
    this.logger.debug('Mailer transporter initialized');
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: this.configService.get<string>('SMTP_FROM_EMAIL'),
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to} with subject: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }
}
