import React from 'react';
import { render, fireEvent } from 'utils/testing';
import Nav from './Nav';

describe('Nav', () => {
  describe('When account button is clicked', () => {
    it('Should open sub menu', () => {
      const { getByText } = render(<Nav />);
      const accountButton = getByText(/my account/i);
      expect(accountButton).toBeDefined();
      fireEvent.click(accountButton);
      expect(getByText(/log out/i)).toBeDefined();
    });
  });
});
