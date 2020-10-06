import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Store from 'store';

const store = new Store();
export const GlobalContext = React.createContext(store);

const GlobalContextProvider = ({ children }) => (
  <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>
);

GlobalContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default observer(GlobalContextProvider);
