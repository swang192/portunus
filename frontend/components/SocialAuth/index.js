import React from 'react';
import PropTypes from 'prop-types';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import Spacer from '@wui/layout/spacer';

import { socialAuth } from '@@/utils/API';
import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from '@@/constants';
import Facebook from './Facebook';
import Google from './Google';

const ERRORS = {
  idpiframe_initialization_failed: 'Cookies must be enabled for you to login using this method.',
  popup_closed_by_user: "Please try again and don't close any popup windows that may have opened.",
  access_denied: 'Please grant the requested permissions in the popup window.',
};

// Some Facebook errors have equivalent meanings to those that Google
//   supplies, so map from one to another.
const FACEBOOK_TO_GOOGLE = {
  not_authorized: 'access_denied',
};

const SocialAuth = ({ handleSuccess, handleError, processing, setProcessing }) => {
  const onFailure = data => {
    // `data.error` is returned by Google. `data.status` is returned by Facebook.
    //    Translate the error from Facebook to the Google equivalent so we don't
    //    have to copy the error message itself.
    data.error = FACEBOOK_TO_GOOGLE[data.status] || data.error;

    const newError = ERRORS[data.error] || 'There was an error. Please try again.';

    handleError({ response: { data: { non_field_errors: newError } } });
  };

  const handleOauth = async (token, provider) => {
    if (processing) {
      return;
    }
    setProcessing(false);

    socialAuth({ token: token.accessToken, email: token.email, provider })
      .then(handleSuccess)
      .catch(handleError);
  };

  return (
    <>
      <GoogleLogin
        buttonText="Google"
        scope="openid email"
        onFailure={onFailure}
        clientId={GOOGLE_CLIENT_ID}
        onSuccess={token =>
          handleOauth(
            {
              email: token.getBasicProfile().getEmail(),
              accessToken: token.getAuthResponse().id_token,
            },
            'google',
          )
        }
        render={Google({ disabled: processing })}
      />

      <Spacer v={14} />

      <FacebookLogin
        fields="email"
        autoLoad={false}
        appId={FACEBOOK_APP_ID}
        icon="facebook-login__icon"
        onFailure={onFailure}
        callback={token => handleOauth(token, 'facebook')}
        render={Facebook({ disabled: processing })}
      />
    </>
  );
};

SocialAuth.propTypes = {
  handleSuccess: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  processing: PropTypes.bool.isRequired,
  setProcessing: PropTypes.func.isRequired,
};

export default SocialAuth;
