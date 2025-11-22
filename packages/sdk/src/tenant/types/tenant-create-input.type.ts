export type TenantCreateInput = {
  name: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  email?: string;
  phoneNumber?: string;
  phoneCode?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  timezone?: string;
  locale?: string;
  maxUsers?: number;
  maxStorage?: number;
  maxApiCalls?: number;
};

