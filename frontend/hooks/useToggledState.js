import { useState } from 'react';

const useToggledState = initial => {
  const [value, setValue] = useState(initial);

  return [value, () => setValue(v => !v)];
};

export default useToggledState;
