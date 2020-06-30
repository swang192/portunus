import Router from 'next/router';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Spacer from '@wui/layout/spacer';
import Button from '@wui/input/button';
import Typography from '@wui/basics/typography';

const BackButton = () => {
  return (
    <Button variant="text" onClick={() => Router.back()}>
      <ArrowBackIcon />
      <Spacer h={8} />
      <Typography>Back</Typography>
    </Button>
  );
};

export default BackButton;
