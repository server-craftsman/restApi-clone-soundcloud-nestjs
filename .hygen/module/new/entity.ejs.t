---
to: src/<%= plural %>/infrastructure/persistence/relational/entities/<%= name %>.entity.ts
---
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
<%_ if (withEnum) { _%>
import { <%= h.changeCase.pascal(enumName || name + 'Status') %> } from '../../../../../enums';
<%_ } _%>

@Entity({ name: '<%= plural %>' })
export class <%= h.changeCase.pascal(name) %>Entity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  <%_ if (withEnum) { _%>
  @Column({
    type: 'enum',
    enum: <%= h.changeCase.pascal(enumName || name + 'Status') %>,
    default: <%= h.changeCase.pascal(enumName || name + 'Status') %>.Pending,
  })
  status!: <%= h.changeCase.pascal(enumName || name + 'Status') %>;
  <%_ } _%>

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
