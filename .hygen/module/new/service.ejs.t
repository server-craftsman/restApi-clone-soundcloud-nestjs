---
to: src/<%= plural %>/service/<%= plural %>.service.ts
---
import { Injectable, NotFoundException } from '@nestjs/common';
import { <%= h.changeCase.pascal(name) %>Repository } from '../infrastructure/persistence/relational/<%= name %>.repository';
import { <%= h.changeCase.pascal(name) %> } from '../domain/<%= name %>';
import { Create<%= h.changeCase.pascal(name) %>Dto, Update<%= h.changeCase.pascal(name) %>Dto } from '../dto';

@Injectable()
export class <%= h.changeCase.pascal(plural) %>Service {
  constructor(
    private readonly <%= h.changeCase.camel(name) %>Repository: <%= h.changeCase.pascal(name) %>Repository,
  ) {}

  async create(dto: Create<%= h.changeCase.pascal(name) %>Dto): Promise<<%= h.changeCase.pascal(name) %>> {
    return this.<%=h.changeCase.camel(name) %>Repository.create(dto);
  }

  async findAll(limit: number = 10, offset: number = 0): Promise<[<%= h.changeCase.pascal(name) %>[], number]> {
    return this.<%= h.changeCase.camel(name) %>Repository.findAll(limit, offset);
  }

  async findById(id: string): Promise<<%= h.changeCase.pascal(name) %>> {
    const <%= h.changeCase.camel(name) %> = await this.<%= h.changeCase.camel(name) %>Repository.findById(id);
    if (!<%= h.changeCase.camel(name) %>) {
      throw new NotFoundException(`<%= h.changeCase.pascal(name) %> with ID ${id} not found`);
    }
    return <%= h.changeCase.camel(name) %>;
  }

  async update(id: string, dto: Update<%= h.changeCase.pascal(name) %>Dto): Promise<<%= h.changeCase.pascal(name) %>> {
    await this.findById(id); // Check if exists
    return this.<%= h.changeCase.camel(name) %>Repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Check if exists
    await this.<%= h.changeCase.camel(name) %>Repository.delete(id);
  }
}
