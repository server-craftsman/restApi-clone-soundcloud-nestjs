---
to: src/<%= plural %>/infrastructure/persistence/relational/repositories/<%= name %>.repository.abstract.ts
---
import { <%= h.changeCase.pascal(name) %> } from '../../../../domain/<%= name %>';

export abstract class <%= h.changeCase.pascal(name) %>RepositoryAbstract {
  // CRUD methods
  abstract findById(id: string): Promise<<%= h.changeCase.pascal(name) %> | null>;
  abstract findAll(limit: number, offset: number): Promise<[<%= h.changeCase.pascal(name) %>[], number]>;
  abstract create(<%= h.changeCase.camel(name) %>: Partial<<%= h.changeCase.pascal(name) %>>): Promise<<%= h.changeCase.pascal(name) %>>; 
  abstract update(id: string, <%= h.changeCase.camel(name) %>: Partial<<%= h.changeCase.pascal(name) %>>): Promise<<%= h.changeCase.pascal(name) %>>;
  abstract delete(id: string): Promise<void>;

  // Add custom domain-specific methods here
  // Example: abstract findByName(name: string): Promise<<%= h.changeCase.pascal(name) %>[]>;
}
