import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  firstName!: string;

  @Column({ type: 'varchar', length: 255 })
  lastName!: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  provider?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  providerId?: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  password?: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  avatar?: string | null;

  @Column({ type: 'text', nullable: true })
  bio?: string | null;

  @Column({ type: 'boolean', default: false })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
