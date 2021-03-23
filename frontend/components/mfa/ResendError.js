import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import Error from './Error';

const title = 'Too Many Resend Requests';

const body = `If you haven't received an email with your security code,
  please contact support to set up two-factor authentication.`;

const loginBody = `If you haven't received an email with your security code,
  please contact support to login to your account.`;

const ResendError = ({ forLogin }) => (
  <Error forLogin={forLogin} title={title} body={forLogin ? loginBody : body} errorCode="102" />
);

ResendError.propTypes = {
  forLogin: PropTypes.bool,
};

ResendError.defaultProps = {
  forLogin: false,
};

export default observer(ResendError);
