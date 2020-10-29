import { observer } from 'mobx-react';

import Layout from 'components/Layout';
import RegisterForm from 'components/Register';

import { useHiddenNav } from 'hooks';

const Register = () => {
  useHiddenNav();

  return (
    <Layout showBanner>
      <RegisterForm />
    </Layout>
  );
};

Register.public = true;

export default observer(Register);
