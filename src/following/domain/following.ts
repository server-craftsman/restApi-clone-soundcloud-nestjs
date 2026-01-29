import { User } from '../../users/domain/user';

export interface Following {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  follower?: User;
  following?: User;
}
