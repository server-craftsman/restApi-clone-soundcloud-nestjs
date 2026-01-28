---
to: src/<%= plural %>/<%= plural %>.controller.ts
---
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth';
import { BaseController } from '../core/base/base.controller';
import { Create<%= h.changeCase.pascal(name) %>Dto, Update<%= h.changeCase.pascal(name) %>Dto } from './dto';
import { <%= h.changeCase.pascal(plural) %>Service } from './service/<%= plural %>.service';

@ApiTags('<%= h.changeCase.pascal(plural) %>')
@Controller('<%= plural %>')
export class <%= h.changeCase.pascal(plural) %>Controller extends BaseController {
  constructor(private readonly <%= h.changeCase.camel(plural) %>Service: <%= h.changeCase.pascal(plural) %>Service) {
    super();
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List all <%= plural %>' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 10 })
  @ApiQuery({ name: 'offset', type: 'number', required: false, example: 0 })
  async findAll(
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @Res() res: Response,
  ) {
    const pageSize = parseInt(limit);
    const pageOffset = parseInt(offset);
    const [<%= h.changeCase.camel(plural) %>, total] = await this.<%= h.changeCase.camel(plural) %>Service.findAll(
      pageSize,
      pageOffset,
    );
    const page = Math.floor(pageOffset / pageSize) + 1;
    return this.sendPaginated(res, <%= h.changeCase.camel(plural) %>, total, page, pageSize);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: '<%= h.changeCase.pascal(name) %> UUID', type: 'string' })
  @ApiResponse({ status: 200, description: '<%= h.changeCase.pascal(name) %> found' })
  @ApiResponse({ status: 404, description: '<%= h.changeCase.pascal(name) %> not found' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const <%= h.changeCase.camel(name) %> = await this.<%= h.changeCase.camel(plural) %>Service.findById(id);
    return this.sendSuccess(res, <%= h.changeCase.camel(name) %>, '<%= h.changeCase.pascal(name) %> retrieved successfully');
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: '<%= h.changeCase.pascal(name) %> created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() dto: Create<%= h.changeCase.pascal(name) %>Dto, @Res() res: Response) {
    const <%= h.changeCase.camel(name) %> = await this.<%= h.changeCase.camel(plural) %>Service.create(dto);
    return this.sendSuccess(
      res,
      <%= h.changeCase.camel(name) %>,
      '<%= h.changeCase.pascal(name) %> created successfully',
      HttpStatus.CREATED,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '<%= h.changeCase.pascal(name) %> UUID', type: 'string' })
  @ApiResponse({ status: 200, description: '<%= h.changeCase.pascal(name) %> updated successfully' })
  @ApiResponse({ status: 404, description: '<%= h.changeCase.pascal(name) %> not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: Update<%= h.changeCase.pascal(name) %>Dto,
    @Res() res: Response,
  ) {
    const <%= h.changeCase.camel(name) %> = await this.<%= h.changeCase.camel(plural) %>Service.update(id, dto);
    return this.sendSuccess(res, <%= h.changeCase.camel(name) %>, '<%= h.changeCase.pascal(name) %> updated successfully');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '<%= h.changeCase.pascal(name) %> UUID', type: 'string' })
  @ApiResponse({ status: 200, description: '<%= h.changeCase.pascal(name) %> deleted successfully' })
  @ApiResponse({ status: 404, description: '<%= h.changeCase.pascal(name) %> not found' })
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.<%= h.changeCase.camel(plural) %>Service.delete(id);
    return this.sendSuccess(res, null, '<%= h.changeCase.pascal(name) %> deleted successfully');
  }
}
