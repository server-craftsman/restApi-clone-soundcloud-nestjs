import { SubscriptionPlan, EmailVerificationStatus } from '../../enums';

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
  emailVerificationStatus: EmailVerificationStatus;
  emailVerificationToken?: string | null;
  emailVerificationTokenExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
