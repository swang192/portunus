import { useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Spacer from '@wui/layout/spacer';
import Button from '@wui/input/button';
import Typography from '@wui/basics/typography';

import { capitalize } from 'utils/strings';

const Resend = ({ action, resendEmail }) => {
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = async () => {
    setError(false);
    setLoading(true);
    try {
      await resendEmail();
      setLinkSent(true);
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  if (linkSent) {
    return (
      <>
        <Typography variant="h4">New {action} password link sent</Typography>
        <Typography>Check your email for your password reset link</Typography>
      </>
    );
  }

  return (
    <>
      <Typography variant="h4">{capitalize(action)} password link expired</Typography>
      <Typography>
        This {action} password link is expired or invalid. Use the button below to request a new
        one.
      </Typography>
      <Spacer v={16} />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        noMinWidth
        onClick={handleClick}
        disabled={loading}
      >
        Send me a new link
      </Button>
      {error && (
        <>
          <Spacer v={8} />
          <Typography color="error">An error occurred. Try again or contact support.</Typography>
        </>
      )}
    </>
  );
};

Resend.propTypes = {
  action: PropTypes.string.isRequired,
  resendEmail: PropTypes.func.isRequired,
};

export default observer(Resend);
