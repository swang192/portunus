import { useState } from 'react';
import { observer } from 'mobx-react';

import PasswordStrengthBar from 'react-password-strength-bar';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Form from '@wui/layout/form';
import Button from '@wui/input/button';
import Spacer from '@wui/layout/spacer';
import Textbox from '@wui/input/textbox';
import Typography from '@wui/basics/typography';

import { useInputFieldState } from '@@/hooks';
import { changePassword, refresh } from '@@/utils/API';
import { INVALID_PASSWORD, AUTH_CHANGE_LOCKOUT } from '@@/utils/constants';
import { MIN_PASSWORD_LENGTH } from '@@/constants';

import Page from '@@/components/Page';
import Success from '@@/components/Success';

const useStyles = makeStyles(theme => ({
  root: {
    padding: [[32, 20]],
    [theme.breakpoints.notPhone]: {
      padding: [[32, 60]],
    },
  },
}));

const ChangePassword = () => {
  const [password, onChangePassword] = useInputFieldState('');
  const [newPassword, onChangeNewPassword] = useInputFieldState('');
  const [newPassword2, onChangeNewPassword2] = useInputFieldState('');
  const [inputErrors, setInputErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [next, setNext] = useState(null);
  const classes = useStyles();

  const validateForm = () => {
    const errors = {};

    if (!password) {
      errors.password = 'Please enter your current password.';
    }

    if (!newPassword) {
      errors.newPassword = 'Please enter a new password.';
    } else if (!newPassword2) {
      errors.newPassword2 = 'Please re-enter your new password.';
    } else if (newPassword !== newPassword2) {
      errors.newPassword2 = 'The two passwords you entered do not match.';
    }

    setInputErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleError = error => {
    if (error.response && error.response.data) {
      if (error.response.data.error === AUTH_CHANGE_LOCKOUT) {
        window.location = '/';
        return;
      }

      const submitError =
        error.response.data.error === INVALID_PASSWORD
          ? error.response.data.validation_error
          : 'Your current password did not match the one we have on file. Try again.';
      setInputErrors({ submitError });
    } else {
      setInputErrors({ submitError: 'An unknown error has occurred. Please try again.' });
    }
    setSuccess(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    refresh().then(() => {
      changePassword({
        password,
        newPassword,
      })
        .then(response => {
          setSuccess(true);
          setNext(response.data.next);
        })
        .catch(handleError);
    });
  };

  if (success) {
    return (
      <Page>
        <Container maxWidth="md" className={classes.root}>
          <Spacer v={32} />
          <Success header="Change Password" message="Your password has been changed!" />
          <Spacer v={32} />
          {next && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                window.location = next;
              }}
            >
              OK
            </Button>
          )}
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container maxWidth="md" className={classes.root}>
        <Typography variant="h4">Change Password</Typography>

        <Form error={inputErrors.submitError} onSubmit={handleSubmit} noMargin>
          <Textbox
            name="current_password"
            type="password"
            label="Current Password"
            value={password}
            onChange={onChangePassword}
            error={inputErrors.password}
          />

          <Textbox
            name="new_password"
            type="password"
            label="New Password"
            value={newPassword}
            onChange={onChangeNewPassword}
            error={inputErrors.newPassword}
          />
          <PasswordStrengthBar password={newPassword} minLength={MIN_PASSWORD_LENGTH} />

          <Textbox
            name="new_password_2"
            type="password"
            label="Confirm New Password"
            value={newPassword2}
            onChange={onChangeNewPassword2}
            error={inputErrors.newPassword2}
          />

          <Spacer v={8} />
          <Button variant="contained" color="primary" type="submit" noMinWidth size="large">
            Change Password
          </Button>
        </Form>
      </Container>
    </Page>
  );
};

export default observer(ChangePassword);
