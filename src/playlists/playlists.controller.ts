import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlaylistsService } from './playlists.service';
import { JwtAuthGuard, CurrentUser } from '../auth';
import { User } from '../users/domain/user';
import { PlaylistDto, CreatePlaylistDto, UpdatePlaylistDto, AddTrackDto } from './dto';

@ApiTags('Playlists')
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create playlist' })
  @ApiResponse({ status: 201, type: PlaylistDto })
  async createPlaylist(
    @Body() dto: CreatePlaylistDto,
    @CurrentUser() user: User,
  ): Promise<PlaylistDto> {
    const playlist = await this.playlistsService.createPlaylist(user.id, dto);
    return {
      id: playlist.id,
      userId: playlist.userId,
      title: playlist.title,
      description: playlist.description,
      isPublic: playlist.isPublic,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get playlist' })
  @ApiResponse({ status: 200, type: PlaylistDto })
  async getPlaylist(@Param('id') id: string): Promise<PlaylistDto> {
    const playlist = await this.playlistsService.getPlaylist(id);
    return {
      id: playlist.id,
      userId: playlist.userId,
      title: playlist.title,
      description: playlist.description,
      isPublic: playlist.isPublic,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user playlists' })
  @ApiResponse({ status: 200 })
  async getUserPlaylists(
    @CurrentUser() user: User,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
  ) {
    const [playlists, total] = await this.playlistsService.getUserPlaylists(
      user.id,
      parseInt(limit),
      parseInt(offset),
    );
    return {
      data: playlists,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update playlist' })
  @ApiResponse({ status: 200, type: PlaylistDto })
  async updatePlaylist(
    @Param('id') id: string,
    @Body() dto: UpdatePlaylistDto,
    @CurrentUser() user: User,
  ): Promise<PlaylistDto> {
    const playlist = await this.playlistsService.updatePlaylist(
      id,
      user.id,
      dto,
    );
    return {
      id: playlist.id,
      userId: playlist.userId,
      title: playlist.title,
      description: playlist.description,
      isPublic: playlist.isPublic,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete playlist' })
  @ApiResponse({ status: 204 })
  async deletePlaylist(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.playlistsService.deletePlaylist(id, user.id);
  }

  @Post(':id/tracks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add track to playlist' })
  @ApiResponse({ status: 201 })
  async addTrack(
    @Param('id') playlistId: string,
    @Body() dto: AddTrackDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.playlistsService.addTrackToPlaylist(
      playlistId,
      dto.trackId,
      user.id,
    );
  }

  @Delete(':id/tracks/:trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove track from playlist' })
  @ApiResponse({ status: 204 })
  async removeTrack(
    @Param('id') playlistId: string,
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.playlistsService.removeTrackFromPlaylist(
      playlistId,
      trackId,
      user.id,
    );
  }

  @Get(':id/tracks')
  @ApiOperation({ summary: 'Get playlist tracks' })
  @ApiResponse({ status: 200 })
  async getPlaylistTracks(
    @Param('id') playlistId: string,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
  ) {
    const [tracks, total] = await this.playlistsService.getPlaylistTracks(
      playlistId,
      parseInt(limit),
      parseInt(offset),
    );
    return {
      data: tracks,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  }
}
