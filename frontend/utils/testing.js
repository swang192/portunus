import PropTypes from 'prop-types';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import theme from '@wui/theme';

const WithTheme = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

WithTheme.propTypes = {
  children: PropTypes.node.isRequired,
};

const wrappedRender = (ui, options) => render(ui, { wrapper: WithTheme, ...options });

export { wrappedRender as render, fireEvent, waitFor, screen };
