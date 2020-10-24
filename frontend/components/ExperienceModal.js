import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Modal from '@wui/basics/modal';
import Typography from '@wui/basics/typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 32,
    [theme.breakpoints.phone]: {
      flexDirection: 'column',
    },
  },
  icon: {
    backgroundColor: '#f1f1f1',
    borderRadius: '50%',
    width: 112,
    height: 112,
    objectFit: 'contain',
    [theme.breakpoints.phone]: {
      width: 80,
      height: 80,
    },
    [theme.breakpoints.notPhone]: {
      marginRight: 32,
      marginBottom: 0,
    },
  },
  content: {
    flexGrow: 2,
    [theme.breakpoints.phone]: {
      textAlign: 'center',
    },
  },
}));

const items = [
  {
    icon: 'badge.svg',
    title: 'Login with your email address',
    body:
      'Use any email address and password to access your account. No more social security or membership numbers needed to login.',
  },
  {
    icon: 'papers.svg',
    title: 'Create your estate plan in about 15 minutes',
    body:
      'Get step-by-step guidance to create wills, powers of attorney, and other estate planning documents online.',
  },
  {
    icon: 'laptop.svg',
    title: 'Everything you need is just a click away',
    body: 'Get access to the legal help you need from anywhere.',
  },
];

const ExperienceModal = ({ open, onClose }) => {
  const classes = useStyles();

  return (
    <Modal
      title="Welcome to the new MetLife Legal Plans website!"
      open={Boolean(open)}
      onClose={onClose}
    >
      {items.map(({ icon, title, body }) => (
        <div className={classes.item} key={title}>
          <img src={`/images/${icon}`} className={classes.icon} alt="" />

          <div className={classes.content}>
            <Typography bold>{title}</Typography>

            <Typography>{body}</Typography>
          </div>
        </div>
      ))}
    </Modal>
  );
};

ExperienceModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default observer(ExperienceModal);
