import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
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

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add like to track' })
  @ApiResponse({ status: 201, type: LikeDto })
  async addLike(
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
  ): Promise<LikeDto> {
    const like = await this.likesService.addLike(user.id, trackId);
    return {
      id: like.id,
      userId: like.userId,
      trackId: like.trackId,
      createdAt: like.createdAt,
    };
  }

  @Delete(':trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove like from track' })
  @ApiResponse({ status: 204 })
  async removeLike(
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.likesService.removeLike(user.id, trackId);
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
  ) {
    const [likes, total] = await this.likesService.getUserLikes(
      user.id,
      parseInt(limit),
      parseInt(offset),
    );
    return {
      data: likes,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  }

  @Get('check/:trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if track is liked' })
  @ApiResponse({ status: 200 })
  async isLiked(
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
  ) {
    const isLiked = await this.likesService.isLiked(user.id, trackId);
    return { isLiked };
  }
}
