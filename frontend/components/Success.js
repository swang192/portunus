import PropTypes from 'prop-types';

import Typography from '@wui/basics/typography';

const Success = props => {
  const { header, message } = props;

  return (
    <>
      <Typography variant="h4">{header}</Typography>
      <Typography variant="body1">{message}</Typography>
    </>
  );
};

Success.propTypes = {
  header: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default Success;
