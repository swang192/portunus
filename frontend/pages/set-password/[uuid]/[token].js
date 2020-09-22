import React from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';

import CompleteResetPassword from '@@/components/CompleteResetPassword';
import Layout from '@@/components/Layout';
import { sendNewUserEmail } from '@@/utils/API';

const SetPassword = () => {
  const router = useRouter();
  const { uuid, token } = router.query;

  return (
    <Layout>
      <CompleteResetPassword
        uuid={uuid}
        token={token}
        action="set"
        resendEmail={() => sendNewUserEmail({ portunusUuid: uuid })}
      />
    </Layout>
  );
};

SetPassword.public = true;

export default observer(SetPassword);
