export type UserMongoDbDto = {
  id: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
};
