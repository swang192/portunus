import { observer } from 'mobx-react';

import Typography from '@wui/basics/typography';

import { login } from '@@/utils/API';
import KeepParamsLink from '@@/components/KeepParamsLink';
import AuthBase from './AuthBase';

const Login = () => {
  return (
    <AuthBase submitCredentials={login} submitText="Login" headerText="Login">
      <Typography>
        Don't have an account yet?&nbsp;
        <KeepParamsLink href="/register">Create Account</KeepParamsLink>
      </Typography>
      <Typography>
        Forgot your password?&nbsp;
        <KeepParamsLink href="/reset-password">Reset Password</KeepParamsLink>
      </Typography>
    </AuthBase>
  );
};

export default observer(Login);
