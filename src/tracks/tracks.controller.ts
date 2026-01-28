import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Patch,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { TracksService } from './service/tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiProduces,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard, CurrentUser } from '../auth';
import { User } from '../users/domain/user';
import { BaseController } from '../core/base/base.controller';
import { HttpStatus } from '@nestjs/common';

const UPLOAD_MAX_FILE_SIZE_BYTES = Number(
  process.env.UPLOAD_MAX_FILE_SIZE_BYTES,
);

@ApiTags('Tracks')
@Controller('tracks')
export class TracksController extends BaseController {
  constructor(private readonly tracksService: TracksService) {
    super();
  }
  @Get()
  @ApiResponse({ status: 200, description: 'List all tracks' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 10 })
  @ApiQuery({ name: 'offset', type: 'number', required: false, example: 0 })
  async listTracks(
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @Res() res: Response,
  ) {
    const pageSize = parseInt(limit);
    const pageOffset = parseInt(offset);
    const [tracks, total] = await this.tracksService.findAll(
      pageSize,
      pageOffset,
    );
    const page = Math.floor(pageOffset / pageSize) + 1;
    return this.sendPaginated(res, tracks, total, page, pageSize);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: UPLOAD_MAX_FILE_SIZE_BYTES },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload audio track with metadata',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string', maxLength: 255 },
        description: { type: 'string', maxLength: 1000 },
        estimatedDurationSeconds: {
          type: 'number',
          description: 'Estimated duration in seconds',
        },

        // Core metadata
        artworkUrl: {
          type: 'string',
          format: 'uri',
          description: 'URL to track artwork image',
        },
        trackLink: {
          type: 'string',
          format: 'uri',
          description: 'External track link',
        },
        mainArtists: {
          type: 'string',
          maxLength: 500,
          description: 'Main artists (comma-separated)',
        },
        genre: { type: 'string', maxLength: 128, description: 'Music genre' },
        tags: {
          type: 'string',
          maxLength: 1000,
          description: 'Tags (comma-separated)',
        },
        privacy: {
          type: 'string',
          enum: ['public', 'private', 'scheduled'],
          default: 'public',
        },
        scheduledAt: {
          type: 'string',
          format: 'date-time',
          description: 'Scheduled publish date (ISO 8601)',
        },

        // Advanced details
        buyLink: {
          type: 'string',
          format: 'uri',
          description: 'Link where fans can purchase the track',
        },
        recordLabel: {
          type: 'string',
          maxLength: 255,
          description: 'Record label name',
        },
        releaseDate: {
          type: 'string',
          format: 'date',
          description: 'Release date',
        },
        publisher: {
          type: 'string',
          maxLength: 255,
          description: 'Publisher name',
        },
        isrc: {
          type: 'string',
          maxLength: 50,
          description: 'International Standard Recording Code',
        },
        containsExplicitContent: {
          type: 'boolean',
          default: false,
          description: 'Track contains explicit content',
        },
        pLine: {
          type: 'string',
          maxLength: 512,
          description: 'P line copyright notice',
        },

        // Permissions
        enableDirectDownloads: {
          type: 'boolean',
          default: false,
          description: 'Allow direct downloads',
        },
        enableOfflineListening: {
          type: 'boolean',
          default: true,
          description: 'Enable offline listening',
        },
        includeInRssFeed: {
          type: 'boolean',
          default: true,
          description: 'Include in RSS feed',
        },
        displayEmbedCode: {
          type: 'boolean',
          default: true,
          description: 'Display embed code',
        },
        enableAppPlayback: {
          type: 'boolean',
          default: true,
          description: 'Enable app playback',
        },

        // Engagement privacy (Pro features)
        allowComments: {
          type: 'boolean',
          default: true,
          description: 'Allow people to comment',
        },
        showCommentsToPublic: {
          type: 'boolean',
          default: true,
          description: 'Show comments to public',
        },
        showInsightsToPublic: {
          type: 'boolean',
          default: false,
          description: 'Show insights to public (Pro plan required)',
        },
        geoblockingType: {
          type: 'string',
          enum: ['worldwide', 'exclusive-regions', 'blocked-regions'],
          default: 'worldwide',
        },
        allowedRegions: {
          type: 'array',
          items: { type: 'string' },
          description: 'Allowed regions (Pro plan)',
        },
        blockedRegions: {
          type: 'array',
          items: { type: 'string' },
          description: 'Blocked regions (Pro plan)',
        },

        // Audio preview
        previewStartTime: {
          type: 'number',
          description: 'Preview start time in seconds for 20-second clip',
        },

        // Licensing
        licenseType: {
          type: 'string',
          enum: ['all-rights-reserved', 'creative-commons'],
          default: 'all-rights-reserved',
        },
      },
      required: ['file', 'title'],
    },
  })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateTrackDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const track = await this.tracksService.createFromUpload(file, dto, user.id);
    return this.sendSuccess(
      res,
      track,
      'Track created successfully',
      HttpStatus.CREATED,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Track UUID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Track updated successfully' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  @ApiResponse({
    status: 400,
    description: 'You can only update your own tracks',
  })
  async updateTrack(
    @Param('id') id: string,
    @Body() dto: UpdateTrackDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const track = await this.tracksService.update(id, dto, user.id);
    return this.sendSuccess(res, track, 'Track updated successfully');
  }

  @Get('scheduled')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List scheduled tracks for current user',
  })
  async getScheduledTracks(@CurrentUser() user: User, @Res() res: Response) {
    const tracks = await this.tracksService.getScheduledTracks(user.id);
    return this.sendSuccess(
      res,
      tracks,
      'Scheduled tracks retrieved successfully',
    );
  }

  @Get(':id/download')
  @ApiParam({ name: 'id', description: 'Track UUID', type: 'string' })
  @ApiProduces('audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg')
  @ApiResponse({
    status: 200,
    description: 'Full audio stream',
    content: {
      'audio/mpeg': { schema: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({
    status: 206,
    description: 'Partial content (range request)',
    content: {
      'audio/mpeg': { schema: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async stream(
    @Param('id') id: string,
    @Headers('range') range: string | undefined,
    @Res() res: Response,
  ) {
    const payload = await this.tracksService.buildStream(id, range);
    const statusCode = range ? 206 : 200;
    const contentLength = payload.end - payload.start + 1;

    res.status(statusCode);
    res.set({
      'Content-Type': payload.contentType,
      'Content-Length': contentLength,
      'Accept-Ranges': 'bytes',
      ...(range
        ? {
            'Content-Range': `bytes ${payload.start}-${payload.end}/${payload.size}`,
          }
        : {}),
    });

    payload.stream.pipe(res);
  }
}
