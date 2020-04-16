import Typography from '@wui/basics/typography';

import { register } from '@@/utils/API';
import KeepParamsLink from '@@/components/KeepParamsLink';
import AuthBase from './AuthBase';

const Register = () => {
  return (
    <AuthBase submitCredentials={register} submitText="Register">
      <Typography>
        Already have an account?&nbsp;
        <KeepParamsLink href="/login">
          <a>Login</a>
        </KeepParamsLink>
      </Typography>
    </AuthBase>
  );
};

export default Register;
