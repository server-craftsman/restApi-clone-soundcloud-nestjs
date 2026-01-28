---
to: src/<%= plural %>/dto/paginated-<%= plural %>.dto.ts
---
import { ApiProperty } from '@nestjs/swagger';
import { <%= h.changeCase.pascal(name) %>Dto } from './<%= name %>.dto';

export class Paginated<%= h.changeCase.pascal(plural) %>Dto {
  @ApiProperty({ type: [<%= h.changeCase.pascal(name) %>Dto] })
  data!: <%= h.changeCase.pascal(name) %>Dto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;

  @ApiProperty()
  totalPages!: number;
}
