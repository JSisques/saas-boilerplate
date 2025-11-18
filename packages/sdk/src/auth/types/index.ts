export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type AuthLoginByEmailInput = {
  email: string;
  password: string;
};

export type AuthRegisterByEmailInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  id: string;
  userId: string;
  email?: string;
  emailVerified?: boolean;
  lastLoginAt?: string;
  provider?: string;
  providerId?: string;
  twoFactorEnabled?: boolean;
};

export type AuthLogoutInput = {
  id: string;
};
