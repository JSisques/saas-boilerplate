export type UserMongoDbDto = {
  id: string;
  avatarUrl: string | null;
  bio: string | null;
  lastName: string | null;
  name: string | null;
  role: string;
  status: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
};
