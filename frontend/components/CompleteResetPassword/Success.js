import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Spacer from '@wui/layout/spacer';
import Typography from '@wui/basics/typography';

import { capitalize } from '@@/utils/strings';

const Success = ({ action }) => (
  <>
    <Typography variant="h4">{capitalize(action)} Password</Typography>
    <body>Password {action} successfully!</body>
    <Spacer v={16} />
    <Typography>
      <Link href="/login">
        <a>Login</a>
      </Link>
    </Typography>
  </>
);

Success.propTypes = {
  action: PropTypes.string.isRequired,
};

export default observer(Success);
