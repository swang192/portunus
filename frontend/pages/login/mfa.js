import { useState } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Container from '@material-ui/core/Container';

import Typography from '@wui/basics/typography';
import Button from '@wui/input/button';
import Spacer from '@wui/layout/spacer';

import Layout from 'components/Layout';
import { useGlobalContext, useHiddenNav } from 'hooks';
import { sendMfaCodeUsingToken, submitMFACode } from 'utils/API';
import MfaCodeForm from 'components/mfa/MfaCodeForm';
import AttemptError from 'components/mfa/AttemptError';
import ResendError from 'components/mfa/ResendError';

const LoginMFA = () => {
  useHiddenNav();
  const [attemptsLocked, setAttemptsLocked] = useState(false);
  const [sendCodeLocked, setSendCodeLocked] = useState(false);
  const store = useGlobalContext();

  const router = useRouter();
  const {
    query: { next, localNext },
  } = router;

  const storeHasData = store.ephemeralMfaToken && store.mfaMethod;

  if (typeof window !== 'undefined' && !storeHasData) {
    router.push('/login');
    return null;
  }

  const submitCode = code =>
    submitMFACode({
      code,
      mfa_token: store.ephemeralMfaToken,
      next,
    });

  const onSuccess = response => {
    // Always prefer using the next parameter when it is present
    if (!response.data.next && localNext) {
      store.login();
      router.push(localNext);
    } else {
      window.location.href = response.data.next;
    }
  };

  return (
    <Layout slim>
      {attemptsLocked && <AttemptError forLogin />}
      {sendCodeLocked && <ResendError forLogin />}
      {!attemptsLocked && !sendCodeLocked && (
        <Container disableGutters maxWidth="sm">
          <Button variant="text" onClick={() => router.push('/login')}>
            <ArrowBackIcon />
            <Spacer h={8} />
            <Typography variant="caption">Back to Login</Typography>
          </Button>
          <Spacer v={16} />
          <Typography variant="h4">Verify Your Account</Typography>
          <Typography variant="body2">
            Enter the 6-digit code sent to{' '}
            {store.loginEmail ? <strong>{store.loginEmail}</strong> : 'your email'}.
          </Typography>
          <MfaCodeForm
            submitCode={submitCode}
            onSuccess={onSuccess}
            sendCode={() =>
              sendMfaCodeUsingToken(store.mfaMethod, { mfaToken: store.ephemeralMfaToken })
            }
            onAttemptLimit={() => setAttemptsLocked(true)}
            onResendLimit={() => setSendCodeLocked(true)}
          />
        </Container>
      )}
    </Layout>
  );
};

LoginMFA.public = true;

export default observer(LoginMFA);
