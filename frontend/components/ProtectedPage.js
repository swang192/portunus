import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react';

import { useGlobalContext } from 'hooks';
import Register from 'pages/register';
import IdleSessionHandler from '../zg_utils/IdleSessionHandler';

const ProtectedPage = ({ children }) => {
  const store = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (store.authenticated || store.loading) return;
    router.replace({
      pathname: '/register',
      shallow: true,
      query: { localNext: router.asPath, next: router.query.next },
    });
  }, [store.authenticated, store.loading]);

  if (store.loading) {
    return <div>Loading...</div>;
  }

  if (!store.authenticated) {
    return <Register />;
  }

  return (
    <>
      <IdleSessionHandler
        expirationHandler={() => {
          router.push('/api/logout/');
        }}
      />
      {children}
    </>
  );
};

ProtectedPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default observer(ProtectedPage);
