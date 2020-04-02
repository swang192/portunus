import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Form from '@wui/layout/form';
import Button from '@wui/input/button';
import Spacer from '@wui/layout/spacer';
import Textbox from '@wui/input/textbox';
import Typography from '@wui/basics/typography';

import useInputFieldState from '../utils/hooks';
import { register } from '../utils/API';

const Register = () => {
  const [email, onChangeEmail] = useInputFieldState('');
  const [password, onChangePassword] = useInputFieldState('');
  const [inputErrors, setInputErrors] = useState({});
  const {
    query: { next },
  } = useRouter();

  const validateForm = () => {
    const errors = {};

    if (!email) {
      errors.email = 'Please enter your email.';
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

    let response;
    try {
      response = await register({
        email: email.toLowerCase(),
        password,
        next,
      });
    } catch (error) {
      setInputErrors(error.response.data || {});
      return;
    }
    window.location.href = response.data.next;
  };

  return (
    <div>
      <Typography variant="h4">Create Account</Typography>
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
        {/* TODO: Terms and Conditions Checkbox */}
        <Button variant="contained" color="primary" type="submit" noMinWidth size="large">
          Register
        </Button>
      </Form>
      <Spacer v={16} />
      <Typography>
        Already have an account?&nbsp;
        <Link href="/login">
          <a>Login</a>
        </Link>
      </Typography>
    </div>
  );
};

export default Register;
