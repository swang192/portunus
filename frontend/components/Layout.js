import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Grid from '@wui/layout/grid';
import Spacer from '@wui/layout/spacer';
import Panel from '@wui/layout/panel';

import MlpLogo from '@@/assets/images/mlp-logo.svg';

const Layout = ({ children }) => {
  return (
    <div>
      <Grid container direction="column" alignItems="center" wrap="nowrap">
        <Spacer v={32} />
        <Spacer v={60} xsDown />
        <Link href="/">
          <a aria-label="Home">
            <MlpLogo alt="Home" />
          </a>
        </Link>
        <Spacer v={32} />
        <Panel>{children}</Panel>
        <Spacer v={92} />
      </Grid>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default observer(Layout);
