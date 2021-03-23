import { useState } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Form from '@wui/layout/form';
import Button from '@wui/input/button';
import Textbox from '@wui/input/textbox';
import Spacer from '@wui/layout/spacer';
import Typography from '@wui/basics/typography';
import Link from '@wui/basics/link';

import { useInputFieldState } from 'hooks';
import { MAX_MFA_ATTEMPTS, MAX_MFA_RESENDS } from 'utils/constants';
import { UNKNOWN_ERROR } from 'utils/constants/errors';

const useStyles = makeStyles(theme => ({
  resendButton: {
    bottom: 3,
  },
  resendSuccess: {
    marginTop: -18,
    lineHeight: '18px',
    color: theme.palette.blue.default,
  },
}));

const MfaCodeForm = ({ submitCode, onSuccess, sendCode, onAttemptLimit, onResendLimit }) => {
  const [securityCode, onChangeSecurityCode] = useInputFieldState('');
  const [inputErrors, setInputErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [numAttempts, setNumAttempts] = useState(0);
  const [numResends, setNumResends] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const classes = useStyles();

  const validateCodeForm = () => {
    const errors = {};

    if (!securityCode) {
      errors.code = 'Please enter the security code.';
    }

    setInputErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleError = error => {
    setResendSuccess(false);
    if (error.response && error.response.data) {
      if (numAttempts + 1 >= MAX_MFA_ATTEMPTS || error.response.data.authLockout) {
        setNumAttempts(0);
        onAttemptLimit();
      } else {
        setNumAttempts(numAttempts + 1);
      }
      setInputErrors(error.response.data);
    } else {
      setInputErrors({ nonFieldErrors: UNKNOWN_ERROR });
    }
  };

  const handleSecurityCode = async e => {
    e.preventDefault();
    if (processing) {
      return;
    }
    setProcessing(true);
    if (!validateCodeForm()) {
      return;
    }

    submitCode(securityCode)
      .then(onSuccess)
      .catch(handleError)
      .finally(() => setProcessing(false));
  };

  const resendCode = () => {
    if (processing) {
      return;
    }
    setProcessing(true);
    if (numResends + 1 >= MAX_MFA_RESENDS) {
      setNumResends(0);
      onResendLimit();
    } else {
      setNumResends(numResends + 1);
    }

    setInputErrors({});

    sendCode()
      .then(() => {
        setResendSuccess(true);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
          setResendSuccess(false);
          setTimeoutId(null);
        }, 3000);
        setTimeoutId(id);
      })
      .catch(() => setInputErrors({ nonFieldErrors: UNKNOWN_ERROR }))
      .finally(() => setProcessing(false));
  };

  return (
    <>
      <Form error={inputErrors.nonFieldErrors} onSubmit={handleSecurityCode} noMargin>
        <Textbox
          name="security_code"
          type="text"
          label="Enter Code"
          value={securityCode}
          onChange={onChangeSecurityCode}
          error={inputErrors.code}
          autoComplete="off"
          InputProps={{ inputProps: { style: { letterSpacing: '6px' } } }}
        />
        <Spacer v={6} />
        <Button
          disabled={processing}
          variant="contained"
          color="primary"
          type="submit"
          noMinWidth
          size="large"
        >
          Verify
        </Button>
      </Form>
      {resendSuccess && (
        <Typography className={classes.resendSuccess}>New Security code sent.</Typography>
      )}
      <Typography variant="body2">
        Didn't receive the code?&nbsp;
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <Link component="button" onClick={resendCode} className={classes.resendButton}>
          <Typography variant="body2" color="inherit">
            Resend
          </Typography>
        </Link>
      </Typography>
    </>
  );
};

MfaCodeForm.propTypes = {
  onAttemptLimit: PropTypes.func,
  onResendLimit: PropTypes.func,
  submitCode: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  sendCode: PropTypes.func.isRequired,
};

MfaCodeForm.defaultProps = {
  onAttemptLimit: () => null,
  onResendLimit: () => null,
};

export default observer(MfaCodeForm);
