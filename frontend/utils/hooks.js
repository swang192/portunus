import { useState } from 'react';

const useInputFieldState = initial => {
  const [value, setValue] = useState(initial);

  return [value, e => setValue(e.target.value)];
};

export default useInputFieldState;
