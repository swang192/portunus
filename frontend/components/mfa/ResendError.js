import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { SUPPORT_PHONE_NUMBER } from 'utils/constants';
import Error from './Error';

const title = 'Too Many Resend Requests';

const ResendError = ({ forLogin }) => {
  const actionDescription = forLogin ? 'log into your account' : 'set up two-factor authentication';
  const body = (
    <>
      If you haven't received an email with your security code, please contact support by chat or by
      phone at <span style={{ whiteSpace: 'nowrap' }}>+1 {SUPPORT_PHONE_NUMBER}</span> to{' '}
      {actionDescription}.
    </>
  );
  return <Error forLogin={forLogin} title={title} body={body} errorCode="102" />;
};

ResendError.propTypes = {
  forLogin: PropTypes.bool,
};

ResendError.defaultProps = {
  forLogin: false,
};

export default observer(ResendError);
