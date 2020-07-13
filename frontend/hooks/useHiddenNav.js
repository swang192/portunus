import { useEffect } from 'react';
import useGlobalContext from './useGlobalContext';

const useHiddenNav = () => {
  const store = useGlobalContext();

  useEffect(() => {
    store.showNavBar = false;

    return () => {
      store.showNavBar = true;
    };
  });
};

export default useHiddenNav;
