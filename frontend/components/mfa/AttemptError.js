import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import Error from './Error';

const title = 'Unable to Verify Security Code';

const body = `There are too many failed attempts on your account.
  Please contact support to set up two-factor authentication.`;

const loginBody =
  'There are too many failed attempts on your account. Please contact support to unlock your account.';

const AttemptError = ({ forLogin }) => (
  <Error
    forLogin={forLogin}
    title={title}
    body={forLogin ? loginBody : body}
    errorCode={forLogin ? '101' : '100'}
  />
);

AttemptError.propTypes = {
  forLogin: PropTypes.bool,
};

AttemptError.defaultProps = {
  forLogin: false,
};

export default observer(AttemptError);
