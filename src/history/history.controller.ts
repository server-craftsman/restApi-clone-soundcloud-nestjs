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
import { HistoryService } from './history.service';
import { JwtAuthGuard, CurrentUser } from '../auth';
import { User } from '../users/domain/user';
import { HistoryDto } from './dto';

@ApiTags('History')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post(':trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add track to history' })
  @ApiResponse({ status: 201, type: HistoryDto })
  async addToHistory(
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
  ): Promise<HistoryDto> {
    const history = await this.historyService.addToHistory(user.id, trackId);
    return {
      id: history.id,
      userId: history.userId,
      trackId: history.trackId,
      listenedAt: history.listenedAt,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user history' })
  @ApiResponse({ status: 200 })
  async getUserHistory(
    @CurrentUser() user: User,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
  ) {
    const [history, total] = await this.historyService.getUserHistory(
      user.id,
      parseInt(limit),
      parseInt(offset),
    );
    return {
      data: history,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  }

  @Delete(':trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove track from history' })
  @ApiResponse({ status: 204 })
  async removeFromHistory(
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.historyService.removeFromHistory(user.id, trackId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear all history' })
  @ApiResponse({ status: 204 })
  async clearHistory(@CurrentUser() user: User): Promise<void> {
    await this.historyService.clearHistory(user.id);
  }
}
