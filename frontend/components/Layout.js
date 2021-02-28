import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Grid from '@wui/layout/grid';
import Spacer from '@wui/layout/spacer';
import Panel from '@wui/layout/panel';

import ExperienceBanner from './ExperienceBanner';

const Layout = ({ showBanner, children }) => (
  <div>
    <Grid container direction="column" alignItems="center" wrap="nowrap">
      <Spacer v={32} />
      <Spacer v={60} xsDown />
      <Link href="/">
        <a aria-label="Home">
          <img src="images/mlp-logo.svg" alt="Home" />
        </a>
      </Link>
      <Spacer v={32} />
      {showBanner && <ExperienceBanner />}
      <Spacer v={32} />
      <Panel>{children}</Panel>
      <Spacer v={92} />
    </Grid>
  </div>
);

Layout.propTypes = {
  showBanner: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Layout.defaultProps = {
  showBanner: false,
};

export default observer(Layout);
