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
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
