

describe('The Log In Page', () => {
  const defaultEmail = Cypress.env('email')
  const defaultPassword = Cypress.env('password')
  const WAIT_TIME_MS = 1000;
    it('successfully loads', () => {
      cy.visit('/login') 
    })
    it('signs in the user', () => {
      const loginUser = (email, password) => {
        cy.get('input[id=email]').type(email)
        cy.get('input[id=password]').type(password)
        cy.get('button').click().wait(WAIT_TIME_MS)
      };
      console.log(defaultEmail)
      loginUser(defaultEmail, defaultPassword)
    })
  })