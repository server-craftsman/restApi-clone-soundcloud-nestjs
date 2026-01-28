---
to: src/<%= plural %>/dto/create-<%= name %>.dto.ts
---
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
<%_ if (withEnum) { _%>
import { IsEnum } from 'class-validator';
import { <%= h.changeCase.pascal(enumName || name + 'Status') %> } from '../../enums';
<%_ } _%>

export class Create<%= h.changeCase.pascal(name) %>Dto {
  @ApiProperty({ maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  <%_ if (withEnum) { _%>
  @ApiProperty({ enum: <%= h.changeCase.pascal(enumName || name + 'Status') %>, default: <%= h.changeCase.pascal(enumName || name + 'Status') %>.Pending })
  @IsEnum(<%= h.changeCase.pascal(enumName || name + 'Status') %>)
  status: <%= h.changeCase.pascal(enumName || name + 'Status') %> = <%= h.changeCase.pascal(enumName || name + 'Status') %>.Pending;
  <%_ } _%>
}
