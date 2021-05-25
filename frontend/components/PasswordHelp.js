import { observer } from 'mobx-react';
import Tooltip from '@wui/layout/tooltip';
import Grid from '@wui/layout/grid';

import PasswordStrengthBar from 'components/PasswordStrengthBar';
import { MIN_PASSWORD_LENGTH, PASSWORD_SPECIAL_CHARACTERS } from 'utils/constants';

const PasswordHelp = props => (
  <Grid container direction="row" alignItems="center" justify="space-between">
    <Grid item xs={10}>
      <PasswordStrengthBar {...props} />
    </Grid>
    <Grid item>
      <Tooltip
        PopperProps={{ keepMounted: true }}
        title={
          <span id="password-help">
            Use {MIN_PASSWORD_LENGTH}+ characters with at least one letter, one number, and one of
            the following special characters: {PASSWORD_SPECIAL_CHARACTERS}
          </span>
        }
      />
    </Grid>
  </Grid>
);

export default observer(PasswordHelp);
