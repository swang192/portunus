import { useState } from 'react';
import { observer } from 'mobx-react';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Form from '@wui/layout/form';
import Button from '@wui/input/button';
import Spacer from '@wui/layout/spacer';
import Textbox from '@wui/input/textbox';
import Typography from '@wui/basics/typography';

import { useInputFieldState } from 'hooks';
import { refresh, changeUserEmail } from 'utils/API';
import Page from 'components/Page';
import Success from 'components/Success';
import {
  AUTH_FAILURE,
  AUTH_CHANGE_LOCKOUT,
  EMAIL_EXISTS,
  LOCKED_OUT_CHANGE_EMAIL,
  STAFF_RESTRICTED_ACTION,
} from 'utils/constants';
import { UNKNOWN_ERROR } from 'utils/constants/errors';
import validateEmail from 'utils/validation';

const useStyles = makeStyles(theme => ({
  root: {
    padding: [[32, 20]],
    [theme.breakpoints.notPhone]: {
      padding: [[32, 60]],
    },
  },
}));

const ChangeEmail = () => {
  const [newEmail, onChangeNewEmail] = useInputFieldState('');
  const [password, onChangePassword] = useInputFieldState('');
  const [inputErrors, setInputErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const classes = useStyles();

  const validateForm = () => {
    const errors = {};

    if (!password) {
      errors.password = 'Please enter your current password.';
    }

    if (!newEmail) {
      errors.newEmail = 'Please enter your email address.';
    } else {
      errors.newEmail = validateEmail(newEmail);
    }

    setInputErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleError = error => {
    if (error.response && error.response.data) {
      if (error.response.data.error === AUTH_CHANGE_LOCKOUT) {
        const params = new URLSearchParams();
        params.append('errorType', LOCKED_OUT_CHANGE_EMAIL);
        window.location = `/register?${params.toString()}`;
        return;
      }
      let submitError;
      if (error.response.data.error === EMAIL_EXISTS) {
        submitError = 'A user with that email address already exists. Try again.';
      } else if (error.response.data.error === AUTH_FAILURE) {
        submitError = 'Your password did not match the one we have for your account. Try again.';
      } else if (error.response.data.error === STAFF_RESTRICTED_ACTION) {
        submitError = 'OAP users cannot change their email.';
      } else {
        submitError = 'The email you entered was not valid.';
      }
      setInputErrors({ submitError });
    } else {
      setInputErrors({ submitError: UNKNOWN_ERROR });
    }
    setSuccess(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    refresh().then(() => {
      changeUserEmail({
        password,
        newEmail: newEmail.toLowerCase(),
      })
        .then(() => setSuccess(true))
        .catch(handleError);
    });
  };

  if (success) {
    return (
      <Page>
        <Container maxWidth="md" className={classes.root}>
          <Spacer v={32} />
          <Success
            header="Change Email"
            message="Check your email for a link to verify your new email address."
          />
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container maxWidth="md" className={classes.root}>
        <Typography variant="h4">Change Email</Typography>

        <Form error={inputErrors.submitError} onSubmit={handleSubmit} noMargin noValidate>
          <Textbox
            name="new_email"
            type="email"
            label="New Email"
            autoComplete="email"
            value={newEmail}
            onChange={onChangeNewEmail}
            error={inputErrors.newEmail}
          />

          <Textbox
            name="password"
            type="password"
            label="Current Password"
            value={password}
            onChange={onChangePassword}
            error={inputErrors.password}
          />

          <Button variant="contained" color="primary" type="submit" noMinWidth size="large">
            Change Email
          </Button>
        </Form>
        <Spacer v={8} />
      </Container>
    </Page>
  );
};

export default observer(ChangeEmail);
