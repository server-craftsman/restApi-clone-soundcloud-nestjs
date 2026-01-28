import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { BaseController } from '../core/base/base.controller';

@ApiTags('Users')
@Controller('users')
export class UsersController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Post()
  @ApiResponse({ status: 201, type: UserDto })
  async create(
    @Body() dto: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.usersService.create(dto);
    return this.sendSuccess(
      res,
      user,
      'User created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get()
  @ApiResponse({ status: 200, type: [UserDto] })
  async findAll(
    @Res() res: Response,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<Response> {
    const pageSize = limit ? parseInt(limit) : 10;
    const pageOffset = offset ? parseInt(offset) : 0;
    const [users, total] = await this.usersService.findAll(
      pageSize,
      pageOffset,
    );
    const page = Math.floor(pageOffset / pageSize) + 1;
    return this.sendPaginated(res, users, total, page, pageSize);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: UserDto })
  async findById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.usersService.findById(id);
    if (!user) {
      return this.sendError(
        res,
        'User not found',
        'Not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.sendSuccess(res, user);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: UserDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.usersService.update(id, dto);
    return this.sendSuccess(res, user, 'User updated successfully');
  }

  @Delete(':id')
  @ApiResponse({ status: 204 })
  async delete(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.usersService.delete(id);
    return this.sendSuccess(
      res,
      null,
      'User deleted successfully',
      HttpStatus.NO_CONTENT,
    );
  }
}
