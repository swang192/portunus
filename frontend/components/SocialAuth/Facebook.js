import React from 'react';
import PropTypes from 'prop-types';

import Button from '@wui/input/button';
import Spacer from '@wui/layout/spacer';

import FacebookIcon from '@@/assets/images/facebook-icon.svg';

// This returns a render prop, which confuses our linter
/* eslint-disable react/prop-types */
const Facebook = ({ disabled: propsDisabled }) => ({
  onClick,
  isDisabled,
  isSdkLoaded,
  isProcessing,
}) => {
  /* eslint-enable */
  const disabled = propsDisabled || isDisabled || !isSdkLoaded || isProcessing;

  return (
    <Button variant="outlined" fullWidth onClick={onClick} disabled={disabled}>
      <FacebookIcon />
      <Spacer h={16} inline />
      Continue with Facebook
    </Button>
  );
};

Facebook.propTypes = {
  disabled: PropTypes.bool,
};

Facebook.defaultProps = {
  disabled: false,
};

export default Facebook;
