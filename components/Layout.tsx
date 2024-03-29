import { PropsWithChildren } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface Props extends PropsWithChildren {
}


export default function Layout({ children }: Props) {
  const router = useRouter();
  const meta = {
    title: 'Stock Watch',
    description: 'Retrieve and display rea; time stock prices and news to user',
    
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta
          property="og:url"
          content={`https://subscription-starter.vercel.app${router.asPath}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
      </Head>
      <main id="skip">{children}</main>
    </>
  );
}
