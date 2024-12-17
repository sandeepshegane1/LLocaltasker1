import type { AppProps } from 'next/app';
import Script from 'next/script';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <>
      <Script
        id="env-script"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.ENV_MAPS_JAVASCRIPT_API_KEY="${process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API_KEY}";
                  window.ENV_PLACES_API_KEY="${process.env.NEXT_PUBLIC_PLACES_API_KEY}";
                  window.ENV_DIRECTION_API_KEY="${process.env.NEXT_PUBLIC_DIRECTION_API_KEY}";`
        }}
      />
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" />
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
