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
import { FollowingService } from './following.service';
import { JwtAuthGuard, CurrentUser } from '../auth';
import { User } from '../users/domain/user';
import { FollowingDto } from './dto';

@ApiTags('Following')
@Controller('following')
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}

  @Post(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({ status: 201, type: FollowingDto })
  async follow(
    @Param('userId') followingId: string,
    @CurrentUser() user: User,
  ): Promise<FollowingDto> {
    const following = await this.followingService.follow(user.id, followingId);
    return {
      id: following.id,
      followerId: following.followerId,
      followingId: following.followingId,
      createdAt: following.createdAt,
    };
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({ status: 204 })
  async unfollow(
    @Param('userId') followingId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.followingService.unfollow(user.id, followingId);
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
  ) {
    const [following, total] = await this.followingService.getUserFollowing(
      user.id,
      parseInt(limit),
      parseInt(offset),
    );
    return {
      data: following,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  }

  @Get('followers/:userId')
  @ApiOperation({ summary: 'Get user followers' })
  @ApiResponse({ status: 200 })
  async getUserFollowers(
    @Param('userId') userId: string,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
  ) {
    const [followers, total] = await this.followingService.getUserFollowers(
      userId,
      parseInt(limit),
      parseInt(offset),
    );
    return {
      data: followers,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  }

  @Get('check/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if following' })
  @ApiResponse({ status: 200 })
  async isFollowing(
    @Param('userId') followingId: string,
    @CurrentUser() user: User,
  ) {
    const isFollowing = await this.followingService.isFollowing(
      user.id,
      followingId,
    );
    return { isFollowing };
  }

  @Get('stats/:userId')
  @ApiOperation({ summary: 'Get user follow stats' })
  @ApiResponse({ status: 200 })
  async getFollowStats(@Param('userId') userId: string) {
    const [followingCount, followersCount] = await Promise.all([
      this.followingService.getFollowingCount(userId),
      this.followingService.getFollowersCount(userId),
    ]);
    return {
      userId,
      followingCount,
      followersCount,
    };
  }
}
