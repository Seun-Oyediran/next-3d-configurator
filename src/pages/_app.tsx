import React from 'react';
import type { AppProps } from 'next/app';

import '../../public/styles/globals.css';
import '../../public/styles/config.css';

function MyApp({ Component, pageProps }: AppProps) {
  const MyComponent: any = Component;
  return <MyComponent {...pageProps} />;
}

export default MyApp;
