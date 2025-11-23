import { SDKAutoProvider } from '@repo/sdk/react';
import { QueryProvider } from '@repo/shared/presentation/providers/query-client-provider';
import { NextIntlClientProvider } from 'next-intl';

interface ProvidersProps extends React.PropsWithChildren {
  apiUrl: string;
  messages: Record<string, string>;
}

const Providers = async ({ children, apiUrl, messages }: ProvidersProps) => {
  return (
    <NextIntlClientProvider messages={messages}>
      <SDKAutoProvider
        apiUrl={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100'}
      >
        <QueryProvider>{children}</QueryProvider>
      </SDKAutoProvider>
    </NextIntlClientProvider>
  );
};

export default Providers;
