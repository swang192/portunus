import Link from 'next/link';

import Typography from '@wui/basics/typography';

import { login } from '@@/utils/API';
import AuthBase from './AuthBase';

const Login = () => {
  return (
    <AuthBase submitCredentials={login} submitText="Login">
      <Typography>
        Don't have an account yet?&nbsp;
        <Link href="/register">
          <a>Create Account</a>
        </Link>
      </Typography>
      <Typography>
        Forgot your password?&nbsp;
        <Link href="/password-reset">
          <a>Reset Password</a>
        </Link>
      </Typography>
    </AuthBase>
  );
};

export default Login;
