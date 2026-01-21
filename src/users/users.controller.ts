import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({ status: 201, type: UserDto })
  async create(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [UserDto] })
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<{ data: UserDto[]; total: number }> {
    const [users, total] = await this.usersService.findAll(
      limit ? parseInt(limit) : 10,
      offset ? parseInt(offset) : 0,
    );
    return { data: users, total };
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: UserDto })
  async findById(@Param('id') id: string): Promise<UserDto | null> {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: UserDto })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserDto> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204 })
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
