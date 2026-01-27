export interface Station {
  id: string;
  userId: string;
  title: string;
  description?: string;
  likedCount: number;
  createdAt: Date;
}
