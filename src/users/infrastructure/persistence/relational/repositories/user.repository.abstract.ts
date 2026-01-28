import { User } from '../../../../domain/user';

export abstract class UserRepositoryAbstract {
  // CRUD methods from BaseRepository pattern
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(limit: number, offset: number): Promise<[User[], number]>;
  abstract create(user: Partial<User>): Promise<User>;
  abstract update(id: string, user: Partial<User>): Promise<User>;
  abstract delete(id: string): Promise<void>;

  // Custom methods specific to User domain
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByProvider(
    provider: string,
    providerId: string,
  ): Promise<User | null>;
  abstract findByEmailVerificationToken(token: string): Promise<User | null>;
}
