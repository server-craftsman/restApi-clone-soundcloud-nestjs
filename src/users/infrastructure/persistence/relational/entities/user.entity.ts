import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  SubscriptionPlan,
  EmailVerificationStatus,
} from '../../../../../enums';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, name: 'first_name' })
  firstName!: string;

  @Column({ type: 'varchar', length: 255, name: 'last_name' })
  lastName!: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  provider?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'provider_id' })
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
    name: 'subscription_plan',
  })
  subscriptionPlan!: SubscriptionPlan;

  @Column({
    type: 'timestamptz',
    nullable: true,
    name: 'subscription_expires_at',
  })
  subscriptionExpiresAt?: Date | null;

  @Column({ type: 'boolean', default: false, name: 'is_active' })
  isActive!: boolean;

  @Column({
    type: 'enum',
    enum: EmailVerificationStatus,
    default: EmailVerificationStatus.Pending,
    nullable: true,
    name: 'email_verification_status',
  })
  emailVerificationStatus?: EmailVerificationStatus | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'email_verification_token',
  })
  emailVerificationToken?: string | null;

  @Column({
    type: 'timestamptz',
    nullable: true,
    name: 'email_verification_token_expires_at',
  })
  emailVerificationTokenExpiresAt?: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
