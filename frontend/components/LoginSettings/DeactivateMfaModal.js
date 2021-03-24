import { useState } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from '@wui/basics/modal';
import Button from '@wui/input/button';
import Spacer from '@wui/layout/spacer';
import Typography from '@wui/basics/typography';

import { UNKNOWN_ERROR } from 'utils/constants/errors';

const DeactivateMfaModal = ({ open, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    onConfirm()
      .then(onClose)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      title="Disable Two-Factor Authentication"
      open={open}
      onClose={onClose}
      onBackdropClick={onClose}
    >
      <Typography variant="body1">
        Disabling two-factor authentication makes your MetLife Legal Plans account less secure.
        Please confirm if you would like to proceed.
      </Typography>
      {error && (
        <Typography variant="body1" color="error">
          {UNKNOWN_ERROR}
        </Typography>
      )}
      <Spacer v={64} />
      <Button
        variant="contained"
        color="primary"
        noMinWidth
        onClick={handleConfirm}
        disabled={loading}
      >
        Confirm
      </Button>
    </Modal>
  );
};

DeactivateMfaModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default observer(DeactivateMfaModal);
