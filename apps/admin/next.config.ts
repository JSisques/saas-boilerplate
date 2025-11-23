import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/shared/presentation/i18n/request.ts',
);

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@repo/sdk', '@repo/shared'],
};

export default withNextIntl(nextConfig);
