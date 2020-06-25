import { observer } from 'mobx-react';

import ProtectedPage from '@@/components/ProtectedPage';
import Link from 'next/link';

const Index = () => {
  return (
    <ProtectedPage>
      <div>Home</div>
      <Link href="/api/logout/">
        <a>Log out</a>
      </Link>
    </ProtectedPage>
  );
};

export default observer(Index);
