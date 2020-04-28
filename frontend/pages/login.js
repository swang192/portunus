import { observer } from 'mobx-react';

import Layout from '@@/components/Layout';
import LoginForm from '@@/components/Login';

const Login = () => {
  return (
    <Layout>
      <LoginForm />
    </Layout>
  );
};

Login.public = true;

export default observer(Login);
