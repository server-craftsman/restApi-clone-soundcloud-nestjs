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
import { FollowingService } from './following.service';
import { JwtAuthGuard, CurrentUser } from '../auth';
import { User } from '../users/domain/user';
import { FollowingDto } from './dto';
import { BaseController } from '../core/base/base.controller';

@ApiTags('Following')
@Controller('following')
export class FollowingController extends BaseController {
  constructor(private readonly followingService: FollowingService) {
    super();
  }

  @Post(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({ status: 201, type: FollowingDto })
  async follow(
    @Param('userId') followingId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    const following = await this.followingService.follow(user.id, followingId);
    const dto: FollowingDto = {
      id: following.id,
      followerId: following.followerId,
      followingId: following.followingId,
      createdAt: following.createdAt,
    };
    this.sendSuccess(res, dto, 'Following successful', 201);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({ status: 204 })
  async unfollow(
    @Param('userId') followingId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    await this.followingService.unfollow(user.id, followingId);
    res.status(204).send();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user following' })
  @ApiResponse({ status: 200 })
  async getUserFollowing(
    @CurrentUser() user: User,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @Res() res: Response,
  ): Promise<void> {
    const pageSize = parseInt(limit);
    const pageOffset = parseInt(offset);
    const [following, total] = await this.followingService.getUserFollowing(
      user.id,
      pageSize,
      pageOffset,
    );
    const page = Math.floor(pageOffset / pageSize) + 1;
    this.sendPaginated(res, following, total, page, pageSize);
  }

  @Get('followers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user followers' })
  @ApiResponse({ status: 200 })
  async getUserFollowers(
    @CurrentUser() user: User,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @Res() res: Response,
  ): Promise<void> {
    const pageSize = parseInt(limit);
    const pageOffset = parseInt(offset);
    const [followers, total] = await this.followingService.getUserFollowers(
      user.id,
      pageSize,
      pageOffset,
    );
    const page = Math.floor(pageOffset / pageSize) + 1;
    this.sendPaginated(res, followers, total, page, pageSize);
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if following' })
  @ApiResponse({ status: 200 })
  async isFollowing(
    @Query('followingId') followingId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    const isFollowing = await this.followingService.isFollowing(
      user.id,
      followingId,
    );
    this.sendSuccess(res, { isFollowing });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user follow stats' })
  @ApiResponse({ status: 200 })
  async getFollowStats(
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    const [followingCount, followersCount] = await Promise.all([
      this.followingService.getFollowingCount(user.id),
      this.followingService.getFollowersCount(user.id),
    ]);
    this.sendSuccess(res, {
      userId: user.id,
      followingCount,
      followersCount,
    });
  }
}
