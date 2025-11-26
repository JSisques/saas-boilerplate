export type TenantUpdateInput = {
  id: string;
  name?: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  status?: string;
  email?: string;
  phoneNumber?: string;
  phoneCode?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  timezone?: string;
  locale?: number | string;
  maxUsers?: string;
  maxStorage?: number;
  maxApiCalls?: number;
};

