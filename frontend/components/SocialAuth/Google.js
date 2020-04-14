import React from 'react';

import Button from '@wui/input/button';
import Spacer from '@wui/layout/spacer';

import GoogleIcon from '@@/assets/images/google-icon.svg';

// This returns a render prop, which confuses our linter
/* eslint-disable react/prop-types */
const Google = ({ disabled: propsDisabled }) => ({ onClick, isDisabled }) => {
  /* eslint-enable */
  const disabled = propsDisabled || isDisabled;

  return (
    <Button variant="outlined" fullWidth onClick={onClick} disabled={disabled}>
      <GoogleIcon />
      <Spacer h={16} inline />
      Continue with Google
    </Button>
  );
};

export default Google;
