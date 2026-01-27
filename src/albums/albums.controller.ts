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
import { AlbumsService } from './albums.service';
import { JwtAuthGuard, CurrentUser } from '../auth';
import { User } from '../users/domain/user';
import { AlbumDto, CreateAlbumDto, UpdateAlbumDto, AddTrackDto } from './dto';

@ApiTags('Albums')
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create album' })
  @ApiResponse({ status: 201, type: AlbumDto })
  async createAlbum(
    @Body() dto: CreateAlbumDto,
    @CurrentUser() user: User,
  ): Promise<AlbumDto> {
    const album = await this.albumsService.createAlbum(user.id, dto);
    return {
      id: album.id,
      userId: album.userId,
      title: album.title,
      description: album.description,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get album' })
  @ApiResponse({ status: 200, type: AlbumDto })
  async getAlbum(@Param('id') id: string): Promise<AlbumDto> {
    const album = await this.albumsService.getAlbum(id);
    return {
      id: album.id,
      userId: album.userId,
      title: album.title,
      description: album.description,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user albums' })
  @ApiResponse({ status: 200 })
  async getUserAlbums(
    @CurrentUser() user: User,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
  ) {
    const [albums, total] = await this.albumsService.getUserAlbums(
      user.id,
      parseInt(limit),
      parseInt(offset),
    );
    return {
      data: albums,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update album' })
  @ApiResponse({ status: 200, type: AlbumDto })
  async updateAlbum(
    @Param('id') id: string,
    @Body() dto: UpdateAlbumDto,
    @CurrentUser() user: User,
  ): Promise<AlbumDto> {
    const album = await this.albumsService.updateAlbum(id, user.id, dto);
    return {
      id: album.id,
      userId: album.userId,
      title: album.title,
      description: album.description,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete album' })
  @ApiResponse({ status: 204 })
  async deleteAlbum(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.albumsService.deleteAlbum(id, user.id);
  }

  @Post(':id/tracks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add track to album' })
  @ApiResponse({ status: 201 })
  async addTrack(
    @Param('id') albumId: string,
    @Body() dto: AddTrackDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.albumsService.addTrackToAlbum(albumId, dto.trackId, user.id);
  }

  @Delete(':id/tracks/:trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove track from album' })
  @ApiResponse({ status: 204 })
  async removeTrack(
    @Param('id') albumId: string,
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.albumsService.removeTrackFromAlbum(albumId, trackId, user.id);
  }

  @Get(':id/tracks')
  @ApiOperation({ summary: 'Get album tracks' })
  @ApiResponse({ status: 200 })
  async getAlbumTracks(
    @Param('id') albumId: string,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
  ) {
    const [tracks, total] = await this.albumsService.getAlbumTracks(
      albumId,
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
