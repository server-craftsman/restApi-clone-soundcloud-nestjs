---
to: src/<%= plural %>/dto/index.ts
---
export * from './create-<%= name %>.dto';
export * from './update-<%= name %>.dto';
export * from './<%= name %>.dto';
export * from './paginated-<%= plural %>.dto';
