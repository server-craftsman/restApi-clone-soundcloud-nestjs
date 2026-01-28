---
to: src/enums/<%= name %>-status.enum.ts
skip_if: <%= !withEnum %>
---
export enum <%= h.changeCase.pascal(enumName || name + 'Status') %> {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
  // Add more status values as needed
}
