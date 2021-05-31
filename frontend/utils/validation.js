const validateEmail = string => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let errorMessage = 'Please enter a valid email.';
  if (!string.includes('@')) {
    errorMessage = "Please include an '@' in the email address.";
  }

  return regex.test(string || '') ? '' : errorMessage;
};

export default validateEmail;
