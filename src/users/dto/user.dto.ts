import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ nullable: true })
  avatar?: string | null;

  @ApiProperty({ nullable: true })
  bio?: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
