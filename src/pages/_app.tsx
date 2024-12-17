import type { AppProps } from 'next/app';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
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
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
