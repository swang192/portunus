import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react';

import { useGlobalContext } from '@@/hooks';
import Register from '@@/pages/register';

const ProtectedPage = ({ children }) => {
  const store = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (store.authenticated || store.loading) return;
    router.replace({ pathname: '/register', shallow: true, query: { localNext: router.asPath } });
  }, [store.authenticated, store.loading]);

  if (store.loading) {
    return <div>Loading...</div>;
  }

  if (!store.authenticated) {
    return <Register />;
  }

  return <>{children}</>;
};

ProtectedPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default observer(ProtectedPage);
