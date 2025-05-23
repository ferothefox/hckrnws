import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href="/img/favicon.ico" rel="shortcut icon" />
        <link href="/img/meta/site.webmanifest" rel="manifest" />
        <link
          href="/img/meta/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/img/meta/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/img/meta/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
        <meta
          name="theme-color"
          content="#fafafa"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#000000"
          media="(prefers-color-scheme: dark)"
        />
      </Head>
      <body className="antialiased bg-primary">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
