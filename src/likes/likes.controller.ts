import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { JwtAuthGuard, CurrentUser } from '../auth';
import { User } from '../users/domain/user';
import { LikeDto } from './dto';
import { BaseController } from '../core/base/base.controller';
import { HttpStatus } from '@nestjs/common';

@ApiTags('Likes')
@Controller('likes')
export class LikesController extends BaseController {
  constructor(private readonly likesService: LikesService) {
    super();
  }

  @Post(':trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add like to track' })
  @ApiResponse({ status: 201, type: LikeDto })
  async addLike(
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const like = await this.likesService.addLike(user.id, trackId);
    return this.sendSuccess(
      res,
      {
        id: like.id,
        userId: like.userId,
        trackId: like.trackId,
        createdAt: like.createdAt,
      },
      'Track liked successfully',
      HttpStatus.CREATED,
    );
  }

  @Delete(':trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove like from track' })
  @ApiResponse({ status: 200 })
  async removeLike(
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    await this.likesService.removeLike(user.id, trackId);
    return this.sendSuccess(res, null, 'Like removed successfully');
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user likes' })
  @ApiResponse({ status: 200 })
  async getUserLikes(
    @CurrentUser() user: User,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @Res() res: Response,
  ) {
    const pageSize = parseInt(limit);
    const pageOffset = parseInt(offset);
    const [likes, total] = await this.likesService.getUserLikes(
      user.id,
      pageSize,
      pageOffset,
    );
    const page = Math.floor(pageOffset / pageSize) + 1;
    return this.sendPaginated(res, likes, total, page, pageSize);
  }

  @Get('check/:trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if track is liked' })
  @ApiResponse({ status: 200 })
  async isLiked(
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const isLiked = await this.likesService.isLiked(user.id, trackId);
    return this.sendSuccess(res, { isLiked }, 'Like status retrieved');
  }
}
