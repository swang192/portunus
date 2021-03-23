import { observer } from 'mobx-react';

import Layout from 'components/Layout';
import LoginForm from 'components/Login';

import { useHiddenNav } from 'hooks';

const Login = () => {
  useHiddenNav();

  return (
    <Layout showBanner>
      <LoginForm />
    </Layout>
  );
};

Login.public = true;

export default observer(Login);
