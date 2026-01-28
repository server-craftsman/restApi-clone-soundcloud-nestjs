---
to: src/<%= plural %>/infrastructure/persistence/relational/relational-persistence.module.ts
---
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { <%= h.changeCase.pascal(name) %>Entity } from './entities/<%= name %>.entity';
import { <%= h.changeCase.pascal(name) %>Repository } from './<%= name %>.repository';
import { <%= h.changeCase.pascal(name) %>Mapper } from './mappers/<%= name %>.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([<%= h.changeCase.pascal(name) %>Entity])],
  providers: [<%= h.changeCase.pascal(name) %>Repository, <%= h.changeCase.pascal(name) %>Mapper],
  exports: [<%= h.changeCase.pascal(name) %>Repository],
})
export class Relational<%= h.changeCase.pascal(name) %>PersistenceModule {}
