import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Container from '@material-ui/core/Container';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Spacer from '@wui/layout/spacer';
import Button from '@wui/input/button';
import Typography from '@wui/basics/typography';

const Error = ({ forLogin, title, body, errorCode }) => {
  const router = useRouter();
  return (
    <Container disableGutters maxWidth="xs">
      <Button variant="text" onClick={() => router.back()}>
        <ArrowBackIcon />
        <Spacer h={8} />
        <Typography variant="caption">Back to {forLogin ? 'Login' : 'Settings'}</Typography>
      </Button>

      <Spacer v={16} />
      <Typography variant="h4">{title}</Typography>
      <Spacer v={4} />
      <Typography variant="body2">{body}</Typography>
      <Spacer v={8} />
      <Typography variant="h4" color="error">
        Reference Error Code MFA-{errorCode}
      </Typography>
    </Container>
  );
};

Error.propTypes = {
  forLogin: PropTypes.bool,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  errorCode: PropTypes.string.isRequired,
};

Error.defaultProps = {
  forLogin: false,
};

export default observer(Error);
