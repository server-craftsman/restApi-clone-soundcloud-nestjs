import { Following } from '../../../../domain/following';

export abstract class FollowingRepositoryAbstract {
  // CRUD methods from BaseRepository pattern
  abstract findById(id: string): Promise<Following | null>;
  abstract findAll(
    limit: number,
    offset: number,
  ): Promise<[Following[], number]>;
  abstract create(following: Partial<Following>): Promise<Following>;
  abstract delete(id: string): Promise<void>;

  // Custom methods specific to Following domain
  abstract findByFollowerAndFollowing(
    followerId: string,
    followingId: string,
  ): Promise<Following | null>;
  abstract findUserFollowing(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[Following[], number]>;
  abstract findUserFollowers(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[Following[], number]>;
  abstract countFollowing(userId: string): Promise<number>;
  abstract countFollowers(userId: string): Promise<number>;
  abstract deleteByFollowerAndFollowing(
    followerId: string,
    followingId: string,
  ): Promise<void>;
}
