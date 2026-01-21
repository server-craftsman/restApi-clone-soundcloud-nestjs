import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../domain/user';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RelationalUserPersistenceModule {}
