import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Grid from '@wui/layout/grid';
import Spacer from '@wui/layout/spacer';
import Panel from '@wui/layout/panel';

import ExperienceBanner from './ExperienceBanner';

const Layout = ({ showBanner, showLogo, children, slim }) => (
  <div>
    <Grid container direction="column" alignItems="center" wrap="nowrap">
      <Spacer v={32} />
      <Spacer v={60} xsDown />
      {showLogo && (
        <Link href="/">
          <a aria-label="Home">
            <img src="/images/mlp-logo.svg" alt="Home" />
          </a>
        </Link>
      )}
      <Spacer v={32} />
      {showBanner && <ExperienceBanner />}
      <Spacer v={32} />
      <Panel lessPadding={slim}>{children}</Panel>
      <Spacer v={92} />
    </Grid>
  </div>
);

Layout.propTypes = {
  showBanner: PropTypes.bool,
  showLogo: PropTypes.bool,
  children: PropTypes.node.isRequired,
  slim: PropTypes.bool,
};

Layout.defaultProps = {
  showBanner: false,
  showLogo: true,
  slim: false,
};

export default observer(Layout);
