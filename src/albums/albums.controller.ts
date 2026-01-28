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
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AlbumsService } from './albums.service';
import { JwtAuthGuard, CurrentUser } from '../auth';
import { User } from '../users/domain/user';
import { AlbumDto, CreateAlbumDto, UpdateAlbumDto, AddTrackDto } from './dto';
import { BaseController } from '../core/base/base.controller';

@ApiTags('Albums')
@Controller('albums')
export class AlbumsController extends BaseController {
  constructor(private readonly albumsService: AlbumsService) {
    super();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create album' })
  @ApiResponse({ status: 201, type: AlbumDto })
  async createAlbum(
    @Body() dto: CreateAlbumDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<Response> {
    const album = await this.albumsService.createAlbum(user.id, dto);
    const albumDto: AlbumDto = {
      id: album.id,
      userId: album.userId,
      title: album.title,
      description: album.description,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
    };
    return this.sendSuccess(
      res,
      albumDto,
      'Album created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get album' })
  @ApiResponse({ status: 200, type: AlbumDto })
  async getAlbum(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const album = await this.albumsService.getAlbum(id);
    const albumDto: AlbumDto = {
      id: album.id,
      userId: album.userId,
      title: album.title,
      description: album.description,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
    };
    return this.sendSuccess(res, albumDto);
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
    @Res() res: Response,
  ): Promise<Response> {
    const pageSize = parseInt(limit);
    const pageOffset = parseInt(offset);
    const [albums, total] = await this.albumsService.getUserAlbums(
      user.id,
      pageSize,
      pageOffset,
    );
    const page = Math.floor(pageOffset / pageSize) + 1;
    return this.sendPaginated(res, albums, total, page, pageSize);
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
    @Res() res: Response,
  ): Promise<Response> {
    const album = await this.albumsService.updateAlbum(id, user.id, dto);
    const albumDto: AlbumDto = {
      id: album.id,
      userId: album.userId,
      title: album.title,
      description: album.description,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
    };
    return this.sendSuccess(res, albumDto, 'Album updated successfully');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete album' })
  @ApiResponse({ status: 204 })
  async deleteAlbum(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<Response> {
    await this.albumsService.deleteAlbum(id, user.id);
    return this.sendSuccess(
      res,
      null,
      'Album deleted successfully',
      HttpStatus.NO_CONTENT,
    );
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
    @Res() res: Response,
  ): Promise<Response> {
    await this.albumsService.addTrackToAlbum(albumId, dto.trackId, user.id);
    return this.sendSuccess(
      res,
      null,
      'Track added to album',
      HttpStatus.CREATED,
    );
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
    @Res() res: Response,
  ): Promise<Response> {
    await this.albumsService.removeTrackFromAlbum(albumId, trackId, user.id);
    return this.sendSuccess(
      res,
      null,
      'Track removed from album',
      HttpStatus.NO_CONTENT,
    );
  }

  @Get(':id/tracks')
  @ApiOperation({ summary: 'Get album tracks' })
  @ApiResponse({ status: 200 })
  async getAlbumTracks(
    @Param('id') albumId: string,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @Res() res: Response,
  ): Promise<Response> {
    const pageSize = parseInt(limit);
    const pageOffset = parseInt(offset);
    const [tracks, total] = await this.albumsService.getAlbumTracks(
      albumId,
      pageSize,
      pageOffset,
    );
    const page = Math.floor(pageOffset / pageSize) + 1;
    return this.sendPaginated(res, tracks, total, page, pageSize);
  }
}
