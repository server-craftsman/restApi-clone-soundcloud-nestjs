---
to: src/<%= plural %>/dto/<%= name %>.dto.ts
---
import { ApiProperty } from '@nestjs/swagger';
<%_ if (withEnum) { _%>
import { <%= h.changeCase.pascal(enumName || name + 'Status') %> } from '../../enums';
<%_ } _%>

export class <%= h.changeCase.pascal(name) %>Dto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  <%_ if (withEnum) { _%>
  @ApiProperty({ enum: <%= h.changeCase.pascal(enumName || name + 'Status') %> })
  status!: <%= h.changeCase.pascal(enumName || name + 'Status') %>;
  <%_ } _%>

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
