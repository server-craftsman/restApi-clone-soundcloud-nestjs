import { SubscriptionPlan } from '../../enums';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  provider?: string | null;
  providerId?: string | null;
  password?: string | null;
  avatar?: string | null;
  bio?: string | null;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserDomain implements User {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  provider?: string | null;
  providerId?: string | null;
  password?: string | null;
  avatar?: string | null;
  bio?: string | null;
  subscriptionPlan!: SubscriptionPlan;
  subscriptionExpiresAt?: Date | null;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
