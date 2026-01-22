import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionPlan } from '../../../../../enums';

@Entity({ name: 'users' })
export class UserEntity {
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

  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.Free,
  })
  subscriptionPlan!: SubscriptionPlan;

  @Column({ type: 'timestamptz', nullable: true })
  subscriptionExpiresAt?: Date | null;

  @Column({ type: 'boolean', default: false })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
