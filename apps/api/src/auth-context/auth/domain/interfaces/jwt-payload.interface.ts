export interface IJwtPayload {
  id: string;
  userId: string;
  email?: string;
  username?: string;
  role: string;
  tenantIds: string[];
}
