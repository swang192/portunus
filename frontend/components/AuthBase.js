import { useState } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import Button from '@wui/input/button';
import Form from '@wui/layout/form';
import Spacer from '@wui/layout/spacer';
import Textbox from '@wui/input/textbox';
import Typography from '@wui/basics/typography';

import TermsCheckbox from '@@/components/TermsCheckbox';
import { useGlobalContext, useInputFieldState } from '@@/hooks';

const AuthBase = ({
  submitCredentials,
  submitText,
  headerText,
  confirmPassword: showConfirmPassword,
  showTerms,
  children,
}) => {
  const [email, onChangeEmail] = useInputFieldState('');
  const [password, onChangePassword] = useInputFieldState('');
  const [confirmPassword, onChangeConfirmPassword] = useInputFieldState('');
  const [termsOfService, setTermsOfService] = useState(false);
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

    if (showConfirmPassword) {
      if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password.';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
      }
    }

    if (showTerms && !termsOfService) {
      errors.terms = 'Please agree to continue.';
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

  const passwordHelp = showConfirmPassword
    ? 'Use 7+ characters with both letters and numbers.'
    : '';

  return (
    <>
      <Typography variant="h4">{headerText}</Typography>
      <Form error={inputErrors.non_field_errors} onSubmit={handleSubmit} noMargin>
        <Textbox
          name="email"
          type="email"
          label="Email"
          autoComplete={showConfirmPassword ? 'off' : 'username'}
          value={email}
          onChange={onChangeEmail}
          error={inputErrors.email}
        />
        <Textbox
          name="password"
          type="password"
          label="Password"
          autoComplete={showConfirmPassword ? 'off' : 'current-password'}
          value={password}
          onChange={onChangePassword}
          error={inputErrors.password}
          helperText={passwordHelp}
        />
        {showConfirmPassword && (
          <Textbox
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            autoComplete="off"
            value={confirmPassword}
            onChange={onChangeConfirmPassword}
            error={inputErrors.confirmPassword}
          />
        )}
        {showTerms && (
          <TermsCheckbox
            onChange={() => setTermsOfService(!termsOfService)}
            error={inputErrors.terms}
          />
        )}
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
    </>
  );
};

AuthBase.propTypes = {
  submitCredentials: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
  headerText: PropTypes.string.isRequired,
  confirmPassword: PropTypes.bool,
  showTerms: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

AuthBase.defaultProps = {
  confirmPassword: false,
  showTerms: false,
};

export default observer(AuthBase);
