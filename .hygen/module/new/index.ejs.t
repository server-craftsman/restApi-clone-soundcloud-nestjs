---
to: src/<%= plural %>/index.ts
---
export * from './dto';
export * from './domain/<%= name %>';
export * from './service/<%= plural %>.service';
export * from './<%= plural %>.module';
