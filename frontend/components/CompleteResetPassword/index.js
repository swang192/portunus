import { useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Form from '@wui/layout/form';
import Button from '@wui/input/button';
import Spacer from '@wui/layout/spacer';
import Textbox from '@wui/input/textbox';
import Typography from '@wui/basics/typography';
import Tooltip from '@wui/layout/tooltip';
import Grid from '@wui/layout/grid';

import { useInputFieldState } from 'hooks';
import { capitalize } from 'utils/strings';
import { completePasswordReset } from 'utils/API';
import {
  INVALID_PASSWORD,
  MIN_PASSWORD_LENGTH,
  PASSWORD_SPECIAL_CHARACTERS,
} from 'utils/constants';
import PasswordStrengthBar from 'components/PasswordStrengthBar';
import Resend from './Resend';

const ResetPasswordComplete = ({ uuid, token, action, resendEmail }) => {
  const [newPassword1, onChangePassword1] = useInputFieldState('');
  const [newPassword2, onChangePassword2] = useInputFieldState('');
  const [inputErrors, setInputErrors] = useState({});
  const [validationError, setValidationError] = useState(null);
  const [showResendLink, setShowResendLink] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!newPassword1) {
      errors.firstPassword = 'Please enter your new password.';
    }

    if (newPassword1 !== newPassword2) {
      errors.secondPassword = 'The two passwords you entered do not match.';
    }

    setInputErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleNewPassword = e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    completePasswordReset({
      newPassword: newPassword1,
      portunusUuid: uuid,
      token,
    })
      .then(response => {
        window.location = response.data.next || '/';
      })
      .catch(error => {
        if (error.response.data.error === INVALID_PASSWORD) {
          setValidationError(error.response.data.validationError);
        } else if (resendEmail) {
          setShowResendLink(true);
        } else {
          setValidationError(
            'Your reset password link is invalid or expired. You can try requesting a new one.',
          );
        }
      });
  };

  if (showResendLink) {
    return <Resend action={action} resendEmail={resendEmail} />;
  }

  return (
    <>
      <Typography variant="h4">Set New Password</Typography>
      <Form error={validationError} onSubmit={handleNewPassword} noMargin>
        <Textbox
          name="new_password"
          type="password"
          label="New Password"
          value={newPassword1}
          onChange={onChangePassword1}
          error={inputErrors.firstPassword}
        />
        <Grid container direction="row" alignItems="center" justify="space-between">
          <Grid item xs={10}>
            <PasswordStrengthBar password={newPassword1} />
          </Grid>
          <Grid item>
            <Tooltip
              title={`Use ${MIN_PASSWORD_LENGTH}+ characters with at least one letter, one number, and one of the following special characters: ${PASSWORD_SPECIAL_CHARACTERS}`}
            />
          </Grid>
        </Grid>
        <Textbox
          name="confirmed_password"
          type="password"
          label="Confirm New Password"
          value={newPassword2}
          onChange={onChangePassword2}
          error={inputErrors.secondPassword}
        />
        <Spacer v={8} />
        <Button variant="contained" color="primary" type="submit" noMinWidth size="large">
          {capitalize(action)} Password
        </Button>
      </Form>
    </>
  );
};

ResetPasswordComplete.propTypes = {
  uuid: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  resendEmail: PropTypes.func,
  action: PropTypes.string,
};

ResetPasswordComplete.defaultProps = {
  action: 'reset',
  resendEmail: null,
};

export default observer(ResetPasswordComplete);
