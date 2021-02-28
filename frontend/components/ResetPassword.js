import { useState } from 'react';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Form from '@wui/layout/form';
import Button from '@wui/input/button';
import Spacer from '@wui/layout/spacer';
import Textbox from '@wui/input/textbox';
import Typography from '@wui/basics/typography';

import { useInputFieldState } from 'hooks';
import { resetPassword } from 'utils/API';
import KeepParamsLink from 'components/KeepParamsLink';

const ResetPassword = () => {
  const [email, onChangeEmail] = useInputFieldState('');
  const [inputError, setInputError] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    let error = '';
    if (!email) {
      error = 'Please enter your email.';
    }

    setInputError(error);

    return !error;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      setSuccess(false);
      return;
    }
    try {
      await resetPassword({
        email: email.toLowerCase(),
      });
      setSuccess(true);
      setValidationError(null);
    } catch (error) {
      setValidationError(
        'Please enter the email associated with your MetLife Legal Plans account.',
      );
      setSuccess(false);
    }
  };

  const resetForm = () => (
    <div>
      <KeepParamsLink href="/login" color="text">
        <ArrowBackIcon />
        <sup>Back to login</sup>
      </KeepParamsLink>
      <Spacer v={32} />
      <Typography variant="h4">Reset Password</Typography>
      <Form error={validationError} onSubmit={handleSubmit} noMargin>
        <Textbox
          name="email"
          type="email"
          label="Recovery Email"
          autoComplete="username"
          value={email}
          onChange={onChangeEmail}
          error={inputError}
        />
        <Button variant="contained" color="primary" type="submit" noMinWidth size="large">
          Request Reset
        </Button>
      </Form>
      <Spacer v={8} />
    </div>
  );

  const successMessage = () => (
    <div>
      <Typography variant="h4">Reset Password</Typography>
      <body>Check your email for your password reset link</body>
    </div>
  );

  return success ? successMessage() : resetForm();
};

export default ResetPassword;
