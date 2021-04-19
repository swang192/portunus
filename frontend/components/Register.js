import { observer } from 'mobx-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Typography from '@wui/basics/typography';
import { register } from 'utils/API';

import KeepParamsLink from 'components/KeepParamsLink';
import MessageModal from 'components/MessageModal';

import AuthBase from './AuthBase';

const Register = () => {
  const router = useRouter();
  const { errorType } = router.query;

  const [showErrorModal, setShowErrorModal] = useState(true);

  useEffect(() => {
    if (errorType) {
      setShowErrorModal(true);
    }
  }, [errorType]);

  return (
    <AuthBase
      submitCredentials={register}
      submitText="Register"
      headerText="Create Account"
      confirmPassword
      showTerms
    >
      <MessageModal
        open={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
        }}
        errorType={errorType}
      />

      <Typography>
        Already have an account?&nbsp;
        <KeepParamsLink href="/login">Login</KeepParamsLink>
      </Typography>
    </AuthBase>
  );
};

export default observer(Register);
