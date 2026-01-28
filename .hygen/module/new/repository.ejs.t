---
to: src/<%= plural %>/infrastructure/persistence/relational/<%= name %>.repository.ts
---
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { <%= h.changeCase.pascal(name) %> } from '../../../domain/<%= name %>';
import { <%= h.changeCase.pascal(name) %>Entity } from './entities/<%= name %>.entity';
import { <%= h.changeCase.pascal(name) %>Mapper } from './mappers/<%= name %>.mapper';
import { <%= h.changeCase.pascal(name) %>RepositoryAbstract } from './repositories/<%= name %>.repository.abstract';
import { BaseRepositoryImpl } from '../../../../core/base/base.repository.impl';

@Injectable()
export class <%= h.changeCase.pascal(name) %>Repository extends <%= h.changeCase.pascal(name) %>RepositoryAbstract {
  private readonly typOrmRepository: Repository<<%= h.changeCase.pascal(name) %>Entity>;
  private readonly baseRepository: BaseRepositoryImpl<<%= h.changeCase.pascal(name) %>Entity>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly mapper: <%= h.changeCase.pascal(name) %>Mapper,
  ) {
    super();
    this.typOrmRepository = this.dataSource.getRepository(<%= h.changeCase.pascal(name) %>Entity);
    this.baseRepository = new BaseRepositoryImpl(this.dataSource, <%= h.changeCase.pascal(name) %>Entity);
  }

  async findById(id: string): Promise<<%= h.changeCase.pascal(name) %> | null> {
    const entity = await this.baseRepository.findById(id);
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(limit: number, offset: number): Promise<[<%= h.changeCase.pascal(name) %>[], number]> {
    const [entities, total] = await this.baseRepository.findAll(offset, limit);
    return [this.mapper.toDomainArray(entities), total];
  }

  async create(<%= h.changeCase.camel(name) %>: Partial<<%= h.changeCase.pascal(name) %>>): Promise<<%= h.changeCase.pascal(name) %>> {
    const entity = this.mapper.toEntity(<%= h.changeCase.camel(name) %>);
    const saved = await this.baseRepository.create(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, <%= h.changeCase.camel(name) %>: Partial<<%= h.changeCase.pascal(name) %>>): Promise<<%= h.changeCase.pascal(name) %>> {
    const entity = this.mapper.toEntity(<%= h.changeCase.camel(name) %>);
    const updated = await this.baseRepository.update(id, entity);
    return this.mapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.baseRepository.delete(id);
  }

  // Add custom domain-specific methods here
}
