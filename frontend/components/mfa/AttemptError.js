import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { SUPPORT_PHONE_NUMBER } from 'utils/constants';
import Error from './Error';

const title = 'Unable to Verify Security Code';

const AttemptError = ({ forLogin }) => {
  const actionDescription = forLogin ? 'unlock your account' : 'set up two-factor authentication';
  const body = (
    <>
      There are too many failed attempts on your account. Please contact support by chat or by phone
      at <span style={{ whiteSpace: 'nowrap' }}>+1 {SUPPORT_PHONE_NUMBER}</span> to{' '}
      {actionDescription}.
    </>
  );
  return (
    <Error forLogin={forLogin} title={title} body={body} errorCode={forLogin ? '101' : '100'} />
  );
};

AttemptError.propTypes = {
  forLogin: PropTypes.bool,
};

AttemptError.defaultProps = {
  forLogin: false,
};

export default observer(AttemptError);
