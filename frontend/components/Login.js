import React, { useState } from 'react';
import Link from 'next/link';

import Form from '@wui/layout/form';
import Button from '@wui/input/button';
import Spacer from '@wui/layout/spacer';
import Textbox from '@wui/input/textbox';
import Typography from '@wui/basics/typography';

import useInputFieldState from '../utils/hooks';
import { login } from '../utils/API';

const Login = () => {
  const [email, onChangeEmail] = useInputFieldState('');
  const [password, onChangePassword] = useInputFieldState('');
  const [inputErrors, setInputErrors] = useState({});
  const [validationError, setValidationError] = useState(null);

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

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await login({
        email: email.toLowerCase(),
        password,
      });
      setValidationError(null);
    } catch (error) {
      setValidationError('ERROR');
    }
  };

  return (
    <div>
      <Typography variant="h4">Login</Typography>
      <Form error={validationError} onSubmit={handleSubmit} noMargin>
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
        <Button variant="contained" color="primary" type="submit" noMinWidth size="large">
          Login
        </Button>
      </Form>
      <Spacer v={16} />
      <Typography>
        Don't have an account yet?&nbsp;
        <Link href="/register">
          <a>Create Account</a>
        </Link>
      </Typography>
      <Typography>
        Forgot your password?&nbsp;
        <Link href="/password-reset">
          <a>Reset Password</a>
        </Link>
      </Typography>
    </div>
  );
};

export default Login;
