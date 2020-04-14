import Link from 'next/link';

import Typography from '@wui/basics/typography';

import { register } from '@@/utils/API';
import AuthBase from './AuthBase';

const Register = () => {
  return (
    <AuthBase submitCredentials={register} submitText="Register">
      <Typography>
        Already have an account?&nbsp;
        <Link href="/login">
          <a>Login</a>
        </Link>
      </Typography>
    </AuthBase>
  );
};

export default Register;
