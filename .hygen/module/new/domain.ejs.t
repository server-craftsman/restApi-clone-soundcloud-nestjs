---
to: src/<%= plural %>/domain/<%= name %>.ts
---
<%_ if (withEnum) { _%>
import { <%= h.changeCase.pascal(enumName || name + 'Status') %> } from '../../enums';

<%_ } _%>
export interface <%= h.changeCase.pascal(name) %> {
  id: string;
  <%_ if (withEnum) { _%>
  status: <%= h.changeCase.pascal(enumName || name + 'Status') %>;
  <%_ } _%>
  createdAt: Date;
  updatedAt: Date;
}

export class <%= h.changeCase.pascal(name) %>Domain implements <%= h.changeCase.pascal(name) %> {
  id!: string;
  <%_ if (withEnum) { _%>
  status!: <%= h.changeCase.pascal(enumName || name + 'Status') %>;
  <%_ } _%>
  createdAt!: Date;
  updatedAt!: Date;

  // Add business logic methods here if needed
}
