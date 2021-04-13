import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import ExternalPasswordStrengthBar from 'react-password-strength-bar';

import { MIN_PASSWORD_LENGTH } from 'utils/constants';

const PasswordStrengthBar = ({ userInputs, password }) => {
  const theme = useTheme();
  return (
    <ExternalPasswordStrengthBar
      password={password}
      minLength={MIN_PASSWORD_LENGTH}
      userInputs={userInputs}
      scoreWordStyle={{ color: theme.palette.text.secondary }}
    />
  );
};

PasswordStrengthBar.propTypes = {
  userInputs: PropTypes.array,
  password: PropTypes.string,
};

PasswordStrengthBar.defaultProps = {
  userInputs: [],
  password: '',
};

export default observer(PasswordStrengthBar);
