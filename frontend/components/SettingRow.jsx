import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';

import Grid from '@wui/layout/grid';
import Button from '@wui/input/button';
import Typography from '@wui/basics/typography';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 30,
    borderLeft: `1px solid ${theme.palette.custom.border}`,
    borderRight: `1px solid ${theme.palette.custom.border}`,
    boxShadow: [
      [0, 1, 0, 0, theme.palette.custom.border],
      [0, 1, 0, 0, theme.palette.custom.border, 'inset'],
    ],
  },
  edit: {
    color: theme.palette.blue.hover,
  },
}));

const AccountSettingRow = ({ value, label, routeTo, hidden }) => {
  const router = useRouter();
  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classes.root}
    >
      <Grid item xs={10} sm={4}>
        <Typography bold variant="body1">
          {label}
        </Typography>
        <Hidden smUp>{value}</Hidden>
      </Grid>

      <Hidden xsDown>
        <Grid item xs={7}>
          {hidden ? '****************' : value}
        </Grid>
      </Hidden>

      <Grid item xs={1}>
        <Button className={classes.edit} onClick={() => router.push(routeTo)}>
          Change
        </Button>
      </Grid>
    </Grid>
  );
};

AccountSettingRow.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  routeTo: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
};

AccountSettingRow.defaultProps = {
  value: '',
  hidden: false,
};

export default observer(AccountSettingRow);
