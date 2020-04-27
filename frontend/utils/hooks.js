import { useState, useContext } from 'react';
import { useObserver } from 'mobx-react';

import { GlobalContext } from '@@/global-context';

export const useInputFieldState = initial => {
  const [value, setValue] = useState(initial);

  return [value, e => setValue(e.target.value)];
};

export const useGlobalContext = () => useObserver(() => useContext(GlobalContext));
