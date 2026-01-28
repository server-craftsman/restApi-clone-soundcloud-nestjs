import { Module } from '@nestjs/common';
import { BaseController } from './base/base.controller';
import { BaseService } from './base/base.service';

@Module({
  providers: [BaseService, BaseController],
  exports: [BaseService, BaseController],
})
export class CoreModule {}
