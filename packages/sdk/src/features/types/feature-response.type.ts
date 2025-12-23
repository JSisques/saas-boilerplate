export type FeatureResponse = {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
