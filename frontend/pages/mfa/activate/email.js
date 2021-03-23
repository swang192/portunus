import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import Container from '@material-ui/core/Container';
import Typography from '@wui/basics/typography';
import Button from '@wui/input/button';
import Spacer from '@wui/layout/spacer';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import MfaCodeForm from 'components/mfa/MfaCodeForm';
import AttemptError from 'components/mfa/AttemptError';
import ResendError from 'components/mfa/ResendError';
import { activateMfa, completeActivateMfa, sendMfaCode } from 'utils/API';
import { UNKNOWN_ERROR } from 'utils/constants/errors';
import Layout from 'components/Layout';
import { useGlobalContext, useHiddenNav } from 'hooks';

const method = 'email';

const submitCode = code => completeActivateMfa('email', { code });

const SetupMFAForm = () => {
  const [error, setError] = useState(false);
  const [attemptsLocked, setAttemptsLocked] = useState(false);
  const [resendsLocked, setResendsLocked] = useState(false);
  const { user } = useGlobalContext();
  const router = useRouter();
  useHiddenNav();

  useEffect(() => {
    if (!user.loading && !user.email) {
      user.loadUserData();
    }
    activateMfa(method).catch(() => setError(true));
  }, []);

  if (attemptsLocked) {
    return (
      <Layout slim>
        <AttemptError />
      </Layout>
    );
  }

  if (resendsLocked) {
    return (
      <Layout slim>
        <ResendError />
      </Layout>
    );
  }

  return (
    <Layout slim>
      <Container disableGutters maxWidth="sm">
        <Button variant="text" onClick={() => router.push('/')}>
          <ArrowBackIcon />
          <Spacer h={8} />
          <Typography variant="caption">Back to Settings</Typography>
        </Button>
        <Spacer v={16} />
        <Typography variant="h4">Enable Two-Factor Authentication</Typography>
        <Typography variant="body2">
          Enter the 6-digit code sent to {user.email ? <strong>{user.email}</strong> : 'your email'}
          .
        </Typography>
        {error ? (
          <Typography varinat="body1" color="error">
            {UNKNOWN_ERROR}
          </Typography>
        ) : (
          <MfaCodeForm
            submitCode={submitCode}
            onSuccess={() => router.replace('/')}
            sendCode={() => sendMfaCode(method)}
            onAttemptLimit={() => setAttemptsLocked(true)}
            onResendLimit={() => setResendsLocked(true)}
          />
        )}
      </Container>
    </Layout>
  );
};

export default observer(SetupMFAForm);
