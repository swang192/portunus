import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import ExternalPasswordStrengthBar from 'react-password-strength-bar';

import { MIN_PASSWORD_LENGTH } from 'utils/constants';

const withAriaLive = word => <span aria-live="polite">{word}</span>;
const defaultScoreWords = ['weak', 'weak', 'okay', 'good', 'strong'];

const useStyles = makeStyles({
  div: {
    '& > div': {
      '& > div': {
        height: '4px !important',
        borderRadius: 3,
      },
    },
  },
});

const PasswordStrengthBar = ({ userInputs, password }) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <ExternalPasswordStrengthBar
      password={password}
      minLength={MIN_PASSWORD_LENGTH}
      userInputs={userInputs}
      scoreWords={defaultScoreWords.map(withAriaLive)}
      shortScoreWord={withAriaLive('too short')}
      scoreWordStyle={{ color: theme.palette.text.primary }}
      barColors={[theme.palette.text.primary, '#EF4836', '#5900FF', '#2F75D0', '#01892A']}
      className={classes.div}
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
