import React from 'react';
import Link from 'next/link';

import Grid from '@wui/layout/grid';
import Spacer from '@wui/layout/spacer';
import Panel from '@wui/layout/panel';

const Layout = ({ children }) => {
  return (
    <div>
      <Grid container direction="column" alignItems="center" wrap="nowrap">
        <Spacer v={32} />
        <Spacer v={60} xsDown />
        <Link href="/">
          <img width={200} src="/metlife_logo.png" alt="metlife logo" />
        </Link>
        <Spacer v={32} />
        <Panel>
          {children}
        </Panel>
        <Spacer v={92} />
      </Grid>
    </div>
  );
}

export default Layout;
