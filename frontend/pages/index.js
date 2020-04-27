import { observer } from 'mobx-react';

import ProtectedPage from '@@/components/ProtectedPage';
import Button from '@wui/input/button';
import { useGlobalContext } from '@@/utils/hooks';

const Index = () => {
  const store = useGlobalContext();
  return (
    <ProtectedPage>
      <div>Home</div>
      <Button onClick={store.logout}>Log out</Button>
    </ProtectedPage>
  );
};

export default observer(Index);
