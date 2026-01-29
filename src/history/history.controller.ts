import {
  Controller,
  Get,
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
import { HistoryService } from './history.service';
import { JwtAuthGuard, CurrentUser } from '../auth';
import { User } from '../users/domain/user';
import { BaseController } from '../core/base/base.controller';

@ApiTags('History')
@Controller('history')
export class HistoryController extends BaseController {
  constructor(private readonly historyService: HistoryService) {
    super();
  }

  //   @Post(':trackId')
  //   @UseGuards(JwtAuthGuard)
  //   @ApiBearerAuth()
  //   @ApiOperation({ summary: 'Add track to history' })
  //   @ApiResponse({ status: 201, type: HistoryDto })
  //   async addToHistory(
  //     @Param('trackId') trackId: string,
  //     @CurrentUser() user: User,
  //   ): Promise<HistoryDto> {
  //     const history = await this.historyService.addToHistory(user.id, trackId);
  //     return {
  //       id: history.id,
  //       userId: history.userId,
  //       trackId: history.trackId,
  //       listenedAt: history.listenedAt,
  //     };
  //   }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user history' })
  @ApiResponse({ status: 200 })
  async getUserHistory(
    @CurrentUser() user: User,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @Res() res: Response,
  ) {
    const pageSize = parseInt(limit);
    const pageOffset = parseInt(offset);
    const [history, total] = await this.historyService.getUserHistory(
      user.id,
      pageSize,
      pageOffset,
    );
    const page = Math.floor(pageOffset / pageSize) + 1;
    return this.sendPaginated(res, history, total, page, pageSize);
  }

  @Delete(':trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove track from history' })
  @ApiResponse({ status: 200 })
  async removeFromHistory(
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    await this.historyService.removeFromHistory(user.id, trackId);
    return this.sendSuccess(res, null, 'Track removed from history');
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear all history' })
  @ApiResponse({ status: 200 })
  async clearHistory(@CurrentUser() user: User, @Res() res: Response) {
    await this.historyService.clearHistory(user.id);
    return this.sendSuccess(res, null, 'History cleared successfully');
  }
}
