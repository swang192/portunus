import { observer } from 'mobx-react';

import ResetPasswordForm from '@@/components/ResetPassword';
import Layout from '@@/components/Layout';

const ResetPassword = () => {
  return (
    <Layout>
      <ResetPasswordForm />
    </Layout>
  );
};

ResetPassword.public = true;

export default observer(ResetPassword);
