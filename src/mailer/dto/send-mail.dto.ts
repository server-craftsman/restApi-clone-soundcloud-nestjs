import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMailDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @ApiProperty({
    description: 'Email subject',
    example: 'Welcome to SoundCloud Clone',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Email body (HTML or plain text)',
    example: '<h1>Welcome</h1><p>Thank you for signing up!</p>',
  })
  @IsString()
  @IsNotEmpty()
  html: string;
}
