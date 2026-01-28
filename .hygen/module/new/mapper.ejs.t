---
to: src/<%= plural %>/infrastructure/persistence/relational/mappers/<%= name %>.mapper.ts
---
import { Injectable } from '@nestjs/common';
import { <%= h.changeCase.pascal(name) %> } from '../../../../domain/<%= name %>';
import { <%= h.changeCase.pascal(name) %>Entity } from '../entities/<%= name %>.entity';

@Injectable()
export class <%= h.changeCase.pascal(name) %>Mapper {
  toDomain(entity: <%= h.changeCase.pascal(name) %>Entity): <%= h.changeCase.pascal(name) %> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      <%_ if (withEnum) { _%>
      status: entity.status,
      <%_ } _%>
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toEntity(<%= h.changeCase.camel(name) %>: Partial<<%= h.changeCase.pascal(name) %>>): Partial<<%= h.changeCase.pascal(name) %>Entity> {
    const entity: Partial<<%= h.changeCase.pascal(name) %>Entity> = {};

    if (<%= h.changeCase.camel(name) %>.id !== undefined) entity.id = <%= h.changeCase.camel(name) %>.id;
    if (<%= h.changeCase.camel(name) %>.name !== undefined) entity.name = <%= h.changeCase.camel(name) %>.name;
    if (<%= h.changeCase.camel(name) %>.description !== undefined) entity.description = <%= h.changeCase.camel(name) %>.description;
    <%_ if (withEnum) { _%>
    if (<%= h.changeCase.camel(name) %>.status !== undefined) entity.status = <%= h.changeCase.camel(name) %>.status;
    <%_ } _%>

    return entity;
  }

  toDomainArray(entities: <%= h.changeCase.pascal(name) %>Entity[]): <%= h.changeCase.pascal(name) %>[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
