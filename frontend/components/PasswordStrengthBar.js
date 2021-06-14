import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import ExternalPasswordStrengthBar from 'react-password-strength-bar';

import { MIN_PASSWORD_LENGTH } from 'utils/constants';

const withAriaLive = word => <span aria-live="polite">{word}</span>;
const defaultScoreWords = ['weak', 'weak', 'okay', 'good', 'strong'];

const PasswordStrengthBar = ({ userInputs, password }) => {
  const theme = useTheme();
  return (
    <ExternalPasswordStrengthBar
      password={password}
      minLength={MIN_PASSWORD_LENGTH}
      userInputs={userInputs}
      scoreWordStyle={{ color: theme.palette.text.secondary }}
      scoreWords={defaultScoreWords.map(withAriaLive)}
      shortScoreWord={withAriaLive('too short')}
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
