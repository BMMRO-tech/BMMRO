
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
      cy.location().should((loc) => {
              expect(loc.pathname).to.eq('/encounters')
       })
    })
  })
describe('creating an Encounter', () => {
  it('goes to create encounter page', () => {
    cy.contains("New").click()
    cy.url().should("include","/encounters/new")
  })

  it('fills out encounter details', () => {
    cy.get('#sequenceNumber').type("123").should("have.value","123")
    cy.get('select').select(1)
    cy.contains("New Habitat Use").click()


  })

  

}
 )