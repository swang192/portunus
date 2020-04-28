import { observer } from 'mobx-react';

import Layout from '@@/components/Layout';
import RegisterForm from '@@/components/Register';

const Register = () => {
  return (
    <Layout>
      <RegisterForm />
    </Layout>
  );
};

Register.public = true;

export default observer(Register);
