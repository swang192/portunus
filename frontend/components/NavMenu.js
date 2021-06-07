import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Link from 'next/link';

import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Modal from '@material-ui/core/Modal';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import Grid from '@wui/layout/grid';
import Spacer from '@wui/layout/spacer';
import Button from '@wui/input/button';
import Typography from '@wui/basics/typography';

import { useScreenSize } from 'hooks';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justify: 'left',
    height: '100%',
    width: '100%',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  popper: {
    zIndex: theme.zIndex.tooltip,
    background: theme.palette.common.white,
  },
  menu: {
    padding: 20,
  },
}));

const NavMenu = ({ open, onClose, anchorEl, title }) => {
  const classes = useStyles();
  const { smDown } = useScreenSize();

  const onKeyDown = e => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const menuList = (
    <MenuList autoFocus onKeyDown={onKeyDown}>
      <MenuItem onClick={onClose} tabIndex={-1}>
        <Typography variant="body1">
          <Link href="/api/logout/">
            <a>Log out</a>
          </Link>
        </Typography>
      </MenuItem>
    </MenuList>
  );

  return smDown ? (
    <Modal open={open} onClose={onClose} className={classes.root}>
      <Paper variant="outlined" className={classes.menu}>
        <Grid container direction="row">
          <Typography bold variant="h3" color="primary">
            {title}
          </Typography>

          <Spacer h={24} />

          <Button onClick={onClose}>Close</Button>
        </Grid>

        <Spacer v={16} />
        {menuList}
      </Paper>
    </Modal>
  ) : (
    <Popper open={open} anchorEl={anchorEl} placement="bottom-end" className={classes.popper}>
      <ClickAwayListener onClickAway={onClose}>
        <Paper variant="outlined">{menuList}</Paper>
      </ClickAwayListener>
    </Popper>
  );
};

NavMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.oneOfType([PropTypes.element, PropTypes.object]),
  title: PropTypes.string,
};

NavMenu.defaultProps = {
  anchorEl: null,
  title: '',
};

export default observer(NavMenu);
