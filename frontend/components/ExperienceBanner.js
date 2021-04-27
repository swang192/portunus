import { observer } from 'mobx-react';
import { useState } from 'react';

import Typography from '@wui/basics/typography';
import { makeStyles } from '@material-ui/core/styles';

import ExperienceModal from 'components/ExperienceModal';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#5f249f',
    padding: [[16, 16]],
    maxWidth: 730,
  },
  bannerText: {
    color: theme.palette.common.white,
    textAlign: 'center',
  },
  button: {
    color: 'inherit',
    font: 'inherit',
    textDecoration: 'underline',
    cursor: 'pointer',
    background: 'none',
    border: 0,
    padding: 0,
  },
}));

const ExperienceBanner = () => {
  const [showModal, setShowModal] = useState(false);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ExperienceModal open={showModal} onClose={() => setShowModal(false)} />
      <div>
        <Typography bold component="span" className={classes.bannerText}>
          Welcome to the new MetLife Legal Plans website.
        </Typography>
        <Typography display="inline" className={classes.bannerText}>
          If you have not created a new account since <b>August 1, 2020</b>, please follow the
          prompt below to create an online account.{' '}
          <button type="button" className={classes.button} onClick={() => setShowModal(true)}>
            Click here to find out what's new!
          </button>
        </Typography>
      </div>
    </div>
  );
};

export default observer(ExperienceBanner);
