import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { makeStyles } from '@material-ui/core/styles';

import Panel from '@wui/layout/panel';
import PanelTitle from '@wui/layout/panelTitle';

const useStyles = makeStyles({
  root: {
    margin: 0,
    width: 'auto',
    borderBottom: 'none',
  },
});

const TableHeader = ({ children }) => {
  const classes = useStyles();

  return (
    <Panel tableRow paddingless>
      <PanelTitle simple className={classes.root}>
        {children}
      </PanelTitle>
    </Panel>
  );
};

TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export default observer(TableHeader);
