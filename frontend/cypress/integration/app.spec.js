describe('Single sign on flow', function () {
  const local = 'http://localhost:3001/';
  const email = 'test@test.com';
  const email2 = 'test2@test.com';
  const password = 'GoodPa$$word1234';
  const password2 = 'GoodPa$$word5678';

  it('creates an account, logs in and out', () => {
    cy.visit('/register');
    cy.findByRole('textbox', { name: /email/i }).type(email);
    cy.findByLabelText(/password/i).type(password);
    cy.findByRole('checkbox').check();
    cy.findByRole('button', { name: /register/i }).click();

    cy.findByRole('button', { name: /my account/i }).click();
    cy.findByRole('menuitem', { name: /log out/i }).click();
    cy.findByRole('button', { name: /my account/i }).should('not.exist');
  });

  it('logs in, changes email and password', () => {
    cy.visit('/login');
    cy.findByRole('textbox', { name: /email/i }).type(email);
    cy.findByLabelText(/password/i).type(password);
    cy.findByRole('button', { name: /login/i }).click();
    cy.url().should('eq', local);

    // Change email
    cy.findAllByRole('button', { name: /change/i })
      .should('have.length', 2)
      .eq(0)
      .click();
    cy.url().should('eq', `${local}change-email`);
    cy.findByRole('textbox', { name: /new email/i }).type(email2);
    cy.findByLabelText(/current password/i).type(password);
    cy.findByRole('button', { name: /change email/i }).click();
    cy.findByText(/check your email for a link to verify your new email address/i).should('exist');

    cy.findByRole('button', { name: /back/i }).click();

    // Change password
    cy.findAllByRole('button', { name: /change/i })
      .eq(1)
      .click();
    cy.url().should('eq', `${local}change-password`);
    cy.findByLabelText(/current password/i).type(password);
    cy.findAllByLabelText(/new password/i)
      .eq(0)
      .type(password2);
    cy.findByLabelText(/confirm new password/i).type(password2);
    cy.findByRole('button', { name: /change password/i }).click();
    cy.findByText(/your password has been changed/i).should('exist');
  });

  it('home is register page, register and login pages link to each other', () => {
    cy.visit('/');
    cy.url().should('include', '/register');
    cy.findByRole('link', { name: /home/i }).click();
    cy.url().should('include', '/register');
    cy.findByRole('link', { name: /login/i }).click();
    cy.url().should('include', '/login');
    cy.findByRole('link', { name: /create account/i }).click();
    cy.url().should('include', '/register');
  });

  it('renders privacy policy and terms of service links', () => {
    cy.visit('/');
    cy.findByRole('link', { name: /privacy policy/i }).should('exist');
    cy.findByRole('link', { name: /terms of service/i }).should('exist');
  });

  it('resets password from login page', () => {
    cy.visit('/login');
    cy.findByRole('link', { name: /reset password/i }).click();
    cy.findByRole('textbox', { name: /recovery email/i }).type(email);
    cy.findByRole('button', { name: /request reset/i }).click();
    cy.findByText(/check your email for your password reset link/i).should('exist');
  });
});
