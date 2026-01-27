import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
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

const UPLOAD_MAX_FILE_SIZE_BYTES = Number(
  process.env.UPLOAD_MAX_FILE_SIZE_BYTES ?? 4 * 1024 * 1024 * 1024,
);

@ApiTags('Tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}
  @Get()
  @ApiResponse({ status: 200, description: 'List all tracks' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 10 })
  @ApiQuery({ name: 'offset', type: 'number', required: false, example: 0 })
  async listTracks(
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
  ) {
    const [tracks, total] = await this.tracksService.findAll(
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
    description: 'Upload audio track',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        description: { type: 'string' },
        estimatedDurationSeconds: { type: 'number' },
      },
      required: ['file', 'title'],
    },
  })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateTrackDto,
    @CurrentUser() user: User,
  ) {
    return this.tracksService.createFromUpload(file, dto, user.id);
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
