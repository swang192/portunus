import { useEffect } from 'react';
import { observer, useStaticRendering } from 'mobx-react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import AxeCore from 'axe-core';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '@wui/theme';

import * as Sentry from '@sentry/react';

import GlobalContextProvider from '@@/global-context';
import { setupCsrf } from '@@/utils/API';
import Nav from '@@/components/Nav';
import ChatWidget from '@@/components/ChatWidget';
import ProtectedPage from '@@/components/ProtectedPage';
import { ZENDESK_CHAT_KEY } from '@@/utils/constants/chat';
import { googleAnalyticsEffect } from '@@/utils/google-analytics';

import env from 'utils/env';

import '@@/global.css';

const isSsr = typeof window === 'undefined';

useStaticRendering(isSsr);

if (!isSsr) {
  Promise.all([env.sentryDsn, env.sentryEnvironment])
    .then(([dsn, environment]) => {
      Sentry.init({ dsn, environment });
    })
    .catch(() => null);
}

/**
 * Accessibility tool - outputs to devtools console on dev only and client-side only.
 * @see https://github.com/dequelabs/react-axe
 * For full list of a11y rules:
 * @see https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
 */
if (process.NODE_ENV !== 'production' && !isSsr) {
  import('react-axe').then(axe => {
    const config = {
      rules: AxeCore.getRules(['wcag21aa', 'wcag2aa', 'wcag2a']).map(rule => ({
        ...rule,
        id: rule.ruleId,
        enabled: true,
      })),
      disableOtherRules: true,
    };

    axe.default(React, ReactDOM, 1000, config);
  });
}

const App = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  });

  useEffect(() => {
    // Ensure the CSRF cookie is set.
    setupCsrf();
  }, []);

  useEffect(googleAnalyticsEffect, []);

  const ProtectComponent = Component.public ? React.Fragment : ProtectedPage;

  return (
    <GlobalContextProvider>
      <ThemeProvider theme={theme}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />

          <link rel="stylesheet" href="/averta.css" />
          <ChatWidget apiKey={ZENDESK_CHAT_KEY} />
          <title>MetLife Legal Plans</title>
        </Head>

        <CssBaseline />
        <ProtectComponent>
          <Nav />
          <Component {...pageProps} />
        </ProtectComponent>
      </ThemeProvider>
    </GlobalContextProvider>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};

App.defaultProps = {
  pageProps: {},
};

export default observer(App);
