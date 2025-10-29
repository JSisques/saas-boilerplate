import { TenantStatusEnum } from '@prisma/client';

export type TenantPrismaDto = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  status: TenantStatusEnum;
  email: string | null;
  phoneNumber: string | null;
  phoneCode: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  timezone: string | null;
  locale: string | null;
  maxUsers: number | null;
  maxStorage: number | null;
  maxApiCalls: number | null;
};
