---
to: src/<%= plural %>/<%= plural %>.module.ts
---
import { Module } from '@nestjs/common';
import { Relational<%= h.changeCase.pascal(name) %>PersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { <%= h.changeCase.pascal(plural) %>Service } from './service/<%= plural %>.service';
import { <%= h.changeCase.pascal(plural) %>Controller } from './<%= plural %>.controller';

@Module({
  imports: [Relational<%= h.changeCase.pascal(name) %>PersistenceModule],
  controllers: [<%= h.changeCase.pascal(plural) %>Controller],
  providers: [<%= h.changeCase.pascal(plural) %>Service],
  exports: [<%= h.changeCase.pascal(plural) %>Service],
})
export class <%= h.changeCase.pascal(plural) %>Module {}
