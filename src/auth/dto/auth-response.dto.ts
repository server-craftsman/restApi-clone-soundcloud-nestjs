import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty()
  accessToken!: string | null;

  @ApiProperty()
  refreshToken?: string | null;

  @ApiProperty()
  user!: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };

  @ApiProperty({ required: false })
  message?: string;
}
