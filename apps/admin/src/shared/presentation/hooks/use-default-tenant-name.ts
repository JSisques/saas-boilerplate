export const useDefaultTenantName = () => {
  const defaultTenantName = process.env.NEXT_PUBLIC_APP_NAME || "Admin Panel";
  const defaultTenantSubtitle = "Admin Panel";

  return {
    defaultTenantName,
    defaultTenantSubtitle,
  };
};
