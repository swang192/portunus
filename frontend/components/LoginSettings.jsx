import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import Spacer from '@wui/layout/spacer';
import Typography from '@wui/basics/typography';
import Grid from '@wui/layout/grid';

import Page from '@@/components/Page';
import SettingRow from '@@/components/SettingRow';
import TableHeader from '@@/components/TableHeader';
import FileAndStore from '@@/assets/images/file-and-store.png';
import { getCurrentUserSettings } from '@@/utils/API';

const useStyles = makeStyles(theme => ({
  root: {
    padding: [[32, 20]],
    [theme.breakpoints.notPhone]: {
      padding: [[32, 60]],
    },
  },
}));

const LoginSettings = () => {
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({});
  const classes = useStyles();

  useEffect(() => {
    async function getUser() {
      try {
        const response = await getCurrentUserSettings();
        setUserData(response.data);
      } catch {
        setError("Couldn't fetch login settings! Please logout and try again.");
      }
    }
    getUser();
  }, []);

  return (
    <Page>
      <Container maxWidth="md" className={classes.root}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <div>
            <Typography variant="h3">Login Settings</Typography>
            <Typography variant="body1">Manage your login settings</Typography>
          </div>
          <img width={246} src={FileAndStore} alt="File Cabinet" />
        </Grid>

        <Spacer v={32} />

        <TableHeader>
          <Typography bold variant="caption">
            LOGIN DETAILS
          </Typography>
        </TableHeader>

        <SettingRow value={userData.email} label="Email" routeTo="/change-email" />
        <SettingRow label="Password" hidden routeTo="/change-password" />

        <Spacer v={24} />
        {error && (
          <>
            <Typography color="error">{error}</Typography>
            <Spacer v={16} />
          </>
        )}
      </Container>
    </Page>
  );
};

export default observer(LoginSettings);
