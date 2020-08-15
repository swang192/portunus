import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';

import BrowserCompatibilityBanner from 'components/BrowserCompatibilityBanner';

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <link rel="stylesheet" href="/averta.css" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/outdated-browser/1.1.5/outdatedbrowser.min.css"
            integrity="sha256-KNfTksp/+PcmJJ0owdo8yBLi/SVMQrH/PNPm25nR/pI="
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <BrowserCompatibilityBanner />

          <Main />
          <NextScript />

          <script
            src="https://cdnjs.cloudflare.com/ajax/libs/outdated-browser/1.1.5/outdatedbrowser.min.js"
            integrity="sha256-yV0saZESxHBqfSfNncH044y3GHbsxLZJbQQmuxrXv90="
            crossOrigin="anonymous"
          />
          <script src="/browserCompatibility.js" />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = async ctx => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
