---
to: src/<%= plural %>/dto/update-<%= name %>.dto.ts
---
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
<%_ if (withEnum) { _%>
import { IsEnum } from 'class-validator';
import { <%= h.changeCase.pascal(enumName || name + 'Status') %> } from '../../enums';
<%_ } _%>

export class Update<%= h.changeCase.pascal(name) %>Dto {
  @ApiPropertyOptional({ maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  <%_ if (withEnum) { _%>
  @ApiPropertyOptional({ enum: <%= h.changeCase.pascal(enumName || name + 'Status') %> })
  @IsEnum(<%= h.changeCase.pascal(enumName || name + 'Status') %>)
  @IsOptional()
  status?: <%= h.changeCase.pascal(enumName || name + 'Status') %>;
  <%_ } _%>
}
