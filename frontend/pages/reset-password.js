import { observer } from 'mobx-react';

import ResetPasswordForm from '@@/components/ResetPassword';
import Layout from '@@/components/Layout';

import { useHiddenNav } from '@@/hooks';

const ResetPassword = () => {
  useHiddenNav();

  return (
    <Layout>
      <ResetPasswordForm />
    </Layout>
  );
};

ResetPassword.public = true;

export default observer(ResetPassword);
