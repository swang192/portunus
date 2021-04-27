import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Button from '@wui/input/button';
import Modal from '@wui/basics/modal';
import Spacer from '@wui/layout/spacer';
import {
  LOCKED_OUT_CHANGE_PASSWORD,
  LOCKED_OUT_CHANGE_EMAIL,
  SUPPORT_PHONE_NUMBER_HREF,
  SUPPORT_PHONE_NUMBER,
  SUPPORT_EMAIL_HREF,
  SUPPORT_EMAIL,
} from '../utils/constants';

const MessageModal = ({ open, onClose, errorType }) => {
  const errorMessages = {};

  errorMessages[LOCKED_OUT_CHANGE_PASSWORD] = {
    displayTitle: 'Change Password Failed',
    displayMessage:
      'You have exceeded the maximum attempts allowed to change your password. For security purposes we have logged you out of your account.',
  };
  errorMessages[LOCKED_OUT_CHANGE_EMAIL] = {
    displayTitle: 'Change Email Failed',
    displayMessage:
      'You have exceeded the maximum attempts allowed to change your email. For security purposes we have logged you out of your account.',
  };

  if (!errorType || !errorMessages[errorType]) {
    return null;
  }

  return (
    <Modal title={errorMessages[errorType].displayTitle} open={open} onClose={onClose}>
      <p> {errorMessages[errorType].displayMessage} </p>
      <p>
        For further assistance or questions please contact us by phone{' '}
        <a href={SUPPORT_PHONE_NUMBER_HREF}>{SUPPORT_PHONE_NUMBER}</a>, <br />
        by email <a href={SUPPORT_EMAIL_HREF}>{SUPPORT_EMAIL}</a> <br />
        or by the chat window conveniently located in the corner of your screen.
      </p>

      <Spacer v={12} />

      <Button variant="outlined" color="primary" onClick={onClose}>
        Dismiss
      </Button>
    </Modal>
  );
};

MessageModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  errorType: PropTypes.string,
};

MessageModal.defaultProps = {
  errorType: '',
};

export default observer(MessageModal);
