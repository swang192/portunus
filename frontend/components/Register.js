import { observer } from 'mobx-react';

import Typography from '@wui/basics/typography';

import { register } from '@@/utils/API';
import KeepParamsLink from '@@/components/KeepParamsLink';
import AuthBase from './AuthBase';

const Register = () => {
  return (
    <AuthBase submitCredentials={register} submitText="Register" headerText="Create Account">
      <Typography>
        Already have an account?&nbsp;
        <KeepParamsLink href="/login">Login</KeepParamsLink>
      </Typography>
    </AuthBase>
  );
};

export default observer(Register);
