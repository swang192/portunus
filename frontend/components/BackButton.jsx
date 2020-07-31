import Router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Spacer from '@wui/layout/spacer';
import Button from '@wui/input/button';
import Typography from '@wui/basics/typography';

const useStyles = makeStyles(theme => ({
  withPadding: {
    padding: theme.spacing(2),
  },
}));

const BackButton = () => {
  const classes = useStyles();

  return (
    <Button variant="text" onClick={() => Router.back()} className={classes.withPadding}>
      <ArrowBackIcon />
      <Spacer h={8} />
      <Typography>Back</Typography>
    </Button>
  );
};

export default BackButton;
