import { useState } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import Grid from '@wui/layout/grid';
import Form from '@wui/layout/form';
import Button from '@wui/input/button';
import Spacer from '@wui/layout/spacer';
import Textbox from '@wui/input/textbox';
import Typography from '@wui/basics/typography';
import TabDivider from '@wui/layout/tabDivider';

import SocialAuth from '@@/components/SocialAuth';
import { useGlobalContext, useInputFieldState } from '@@/utils/hooks';

const AuthBase = ({ submitCredentials, submitText, children }) => {
  const [email, onChangeEmail] = useInputFieldState('');
  const [password, onChangePassword] = useInputFieldState('');
  const [inputErrors, setInputErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const {
    query: { next, localNext },
  } = router;
  const store = useGlobalContext();

  if (store.authenticated) {
    router.push('/');
  }

  const validateForm = () => {
    const errors = {};

    if (!email) {
      errors.email = 'Please enter your email';
    }

    if (!password) {
      errors.password = 'Please enter your password.';
    }

    setInputErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSuccess = response => {
    if (localNext) {
      store.login();
      router.push(localNext);
    } else {
      window.location.href = response.data.next;
    }
  };

  const handleError = error => {
    if (error.response && error.response.data) {
      setInputErrors(error.response.data);
    } else {
      setInputErrors({ non_field_errors: 'An unknown error has occurred. Please try again.' });
    }
    setProcessing(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (processing || !validateForm()) {
      return;
    }

    setProcessing(true);

    submitCredentials({
      email: email.toLowerCase(),
      password,
      next,
    })
      .then(handleSuccess)
      .catch(handleError);
  };

  return (
    <>
      <Typography variant="h4">Login</Typography>
      <Form error={inputErrors.non_field_errors} onSubmit={handleSubmit} noMargin>
        <Textbox
          name="email"
          type="email"
          label="Email"
          autoComplete="username"
          value={email}
          onChange={onChangeEmail}
          error={inputErrors.email}
        />
        <Textbox
          name="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={onChangePassword}
          error={inputErrors.password}
        />
        <Spacer v={8} />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          noMinWidth
          size="large"
          disabled={processing}
        >
          {submitText}
        </Button>
      </Form>

      <Spacer v={16} />

      {children}

      <Spacer v={24} />

      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        alignContent="center"
        spacing={2}
      >
        <Grid item xs={3}>
          <TabDivider noMargin />
        </Grid>

        <Grid item xs={1}>
          <Typography variant="intro">or</Typography>
        </Grid>

        <Grid item xs={3}>
          <TabDivider noMargin />
        </Grid>
      </Grid>

      <Spacer v={24} />

      <SocialAuth
        handleSuccess={handleSuccess}
        handleError={handleError}
        processing={processing}
        setProcessing={setProcessing}
      />
      <Spacer v={16} />
    </>
  );
};

AuthBase.propTypes = {
  submitCredentials: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default observer(AuthBase);
