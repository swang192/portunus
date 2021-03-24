import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import Spacer from '@wui/layout/spacer';
import Typography from '@wui/basics/typography';
import Grid from '@wui/layout/grid';

import Page from 'components/Page';
import SettingRow from 'components/SettingRow';
import TableHeader from 'components/TableHeader';
import { completeDeactivateMfa, getMfaMethods } from 'utils/API';
import { UNKNOWN_ERROR } from 'utils/constants/errors';
import { useGlobalContext } from 'hooks';
import DeactivateMfaModal from './DeactivateMfaModal';

const useStyles = makeStyles(theme => ({
  root: {
    padding: [[32, 20]],
    [theme.breakpoints.notPhone]: {
      padding: [[32, 60]],
    },
  },
}));

const mfaLabel = 'Two-Factor Authentication';

const LoginSettings = ({ showBack }) => {
  const [error, setError] = useState('');
  // We initialize mfaActive to null to indicate that we haven't yet received
  // the data from the server.
  const [mfaActive, setMfaActive] = useState(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const { user } = useGlobalContext();
  const classes = useStyles();

  useEffect(() => {
    user.loadUserData();
  }, []);

  useEffect(() => {
    getMfaMethods()
      .then(response => {
        const primaryMethods = response.data.filter(m => m.isPrimary);
        setMfaActive(primaryMethods.length > 0);
      })
      .catch(() => setError(UNKNOWN_ERROR));
  }, []);

  const deactivateMfa = () =>
    completeDeactivateMfa('email')
      .then(() => setMfaActive(false))
      .catch(() => setError(UNKNOWN_ERROR));

  let mfaRow = <SettingRow value="" label={mfaLabel} actionName="" />;
  if (mfaActive !== null) {
    mfaRow = mfaActive ? (
      <SettingRow
        value="Two-factor authentication is enabled. You will sign in using your password and a security code sent to your email."
        label={mfaLabel}
        action={() => setShowDeactivateModal(true)}
        actionName="Deactivate"
      />
    ) : (
      <SettingRow
        value="Add an extra layer of security in case your password is stolen. Sign in using your password and a security code sent to your email."
        label={mfaLabel}
        routeTo="/mfa/activate/email"
        actionName="Activate"
      />
    );
  }

  const errorDisplay = user.error
    ? "Couldn't fetch login settings! Please logout and try again."
    : error;

  return (
    <Page showBack={showBack}>
      <DeactivateMfaModal
        open={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={deactivateMfa}
      />
      <Container maxWidth="md" className={classes.root}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <div>
            <Typography variant="h3">Login Settings</Typography>
            <Typography variant="body1">Manage your login settings</Typography>
          </div>
          <img width={246} src="/images/file-and-store.png" alt="File Cabinet" />
        </Grid>

        <Spacer v={32} />

        <TableHeader>
          <Typography bold variant="caption">
            LOGIN DETAILS
          </Typography>
        </TableHeader>

        <SettingRow value={user.email || ''} label="Email" routeTo="/change-email" />
        <SettingRow label="Password" hidden routeTo="/change-password" />
        {mfaRow}
        <Spacer v={24} />
        {errorDisplay && (
          <>
            <Typography color="error">{errorDisplay}</Typography>
            <Spacer v={16} />
          </>
        )}
      </Container>
    </Page>
  );
};

LoginSettings.propTypes = {
  showBack: PropTypes.bool,
};

LoginSettings.defaultProps = {
  showBack: true,
};

export default observer(LoginSettings);
