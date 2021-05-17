import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Grid from '@wui/layout/grid';
import Spacer from '@wui/layout/spacer';
import Panel from '@wui/layout/panel';

const Layout = ({ showLogo, children, slim }) => (
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
      <Panel lessPadding={slim}>{children}</Panel>
      <Spacer v={92} />
    </Grid>
  </div>
);

Layout.propTypes = {
  showLogo: PropTypes.bool,
  children: PropTypes.node.isRequired,
  slim: PropTypes.bool,
};

Layout.defaultProps = {
  showLogo: true,
  slim: false,
};

export default observer(Layout);
