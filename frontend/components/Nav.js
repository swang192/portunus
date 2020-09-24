import { useState } from 'react';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import PhoneIcon from '@material-ui/icons/Phone';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Grid from '@wui/layout/grid';
import Button from '@wui/input/button';
import Spacer from '@wui/layout/spacer';
import Typography from '@wui/basics/typography';

import { useToggledState, useGlobalContext } from '@@/hooks';
import NavMenu from '@@/components/NavMenu';
import { SUPPORT_PHONE_NUMBER } from '@@/constants';
import MlpLogo from '@@/assets/images/mlp-logo.svg';

const useStyles = makeStyles(theme => ({
  appBar: {
    background: theme.palette.common.white,
    borderBottom: `2px solid ${theme.palette.custom.border}`,
  },
  toolBar: {
    [theme.breakpoints.up('sm')]: {
      padding: [[0, theme.layout.side.default * 2]],
    },
  },
  logo: {
    maxHeight: 33,
  },
  popper: {
    zIndex: theme.zIndex.tooltip,
    background: theme.palette.common.white,
  },
  navItems: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

const Nav = () => {
  const [menu, toggleMenu] = useToggledState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const store = useGlobalContext();
  const classes = useStyles();
  const menuText = 'My Account';
  const { query } = useRouter();

  const onClick = e => {
    setMenuAnchor(e.currentTarget);
    toggleMenu();
  };

  const handleClose = () => {
    toggleMenu();
    setMenuAnchor(null);
  };

  if (!store.showNavBar) {
    return null;
  }

  return (
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar className={classes.toolBar}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Link href={{ pathname: '/', query }}>
            <a aria-label="Home">
              <MlpLogo alt="Go to the home page" className={classes.logo} />
            </a>
          </Link>

          <Hidden mdUp>
            <IconButton edge="end" aria-label="menu" onClick={onClick}>
              <MenuIcon />
            </IconButton>
          </Hidden>

          <Hidden smDown>
            <div className={classes.navItems}>
              <Button href={`tel:${SUPPORT_PHONE_NUMBER}`} startIcon={<PhoneIcon />}>
                <Typography variant="body2">{SUPPORT_PHONE_NUMBER}</Typography>
              </Button>

              <Spacer h={16} />
              <Divider orientation="vertical" flexItem />
              <Spacer h={16} />

              <Button onClick={onClick} endIcon={menu ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
                <Typography variant="body2">{menuText}</Typography>
              </Button>
            </div>
          </Hidden>
        </Grid>

        <NavMenu open={menu} onClose={handleClose} anchorEl={menuAnchor} title={menuText} />
      </Toolbar>
    </AppBar>
  );
};

export default observer(Nav);
