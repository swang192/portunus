import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Typography from '@wui/basics/typography';
import Spacer from '@wui/layout/spacer';

import { completeChangeUserEmail } from 'utils/API';
import Page from 'components/Page';
import Success from 'components/Success';

const useStyles = makeStyles(theme => ({
  root: {
    padding: [[32, 20]],
    [theme.breakpoints.notPhone]: {
      padding: [[32, 60]],
    },
  },
}));

const ChangeEmailComplete = ({ token, newEmail }) => {
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  const handleNewEmail = async () => {
    try {
      await completeChangeUserEmail({
        token,
        newEmail,
      });
      setValidationError(null);
      setSuccess(true);
    } catch (error) {
      const errorMsg =
        'Your change email link is invalid or expired. You can try requesting a new one. Your email has not been changed.';
      setValidationError(errorMsg);
    }
    setLoading(false);
  };

  const successMessage = () => (
    <Page>
      <Container maxWidth="md" className={classes.root}>
        <Spacer v={32} />
        <Success header="Change Email" message="Your email address has been changed!" />
      </Container>
    </Page>
  );

  const errorMessage = () => (
    <Page>
      <Container maxWidth="md" className={classes.root}>
        <Typography variant="h4">Change Email Error</Typography>
        <Typography variant="body1">{validationError}</Typography>
      </Container>
    </Page>
  );

  const onLoading = () => <div>Loading...</div>;

  useEffect(() => {
    handleNewEmail();
  }, []);

  if (loading) {
    return onLoading();
  }
  if (success) {
    return successMessage();
  }
  return errorMessage();
};

ChangeEmailComplete.propTypes = {
  token: PropTypes.string.isRequired,
  newEmail: PropTypes.string.isRequired,
};

export default observer(ChangeEmailComplete);
