import { useState } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import Checkbox from '@wui/input/checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import Spacer from '@wui/layout/spacer';
import Typography from '@wui/basics/typography';

import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from 'utils/constants';

const TermsCheckbox = ({ onChange, error }) => {
  const [termsOfService, setTermsOfService] = useState(false);

  const updateState = e => {
    setTermsOfService(!termsOfService);
    onChange(e);
  };

  const label = (
    <Typography variant="caption">
      I agree to the&nbsp;
      <a target="_blank" href={PRIVACY_POLICY_URL} rel="noreferrer">
        Terms of Service
      </a>
      &nbsp;and&nbsp;
      <a target="_blank" href={TERMS_OF_SERVICE_URL} rel="noreferrer">
        Privacy Policy
      </a>
    </Typography>
  );

  return (
    <>
      <Spacer v={16} />
      <Checkbox
        name="termsOfService"
        label={label}
        onChange={updateState}
        checked={Boolean(termsOfService)}
        aria-describedby="helperText"
      />
      <FormHelperText error id="helperText" aria-live="assertive">
        {error || <span>&nbsp;</span>}
      </FormHelperText>
    </>
  );
};

TermsCheckbox.propTypes = {
  onChange: PropTypes.func,
  error: PropTypes.string,
};

TermsCheckbox.defaultProps = {
  onChange: () => null,
  error: '',
};

export default observer(TermsCheckbox);
