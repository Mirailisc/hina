import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'

Given('I visit the register page', () => {
  cy.visit('/register')
})

Given('I visit the login page', () => {
  cy.visit('/login')
})

When('I input username {string} and password {string}', (username: string, password: string) => {
  cy.get('input[name="username"]').type(username)
  cy.get('input[name="password"]').type(password)
})

When('I confirm the password {string}', (confirmPassword: string) => {
  cy.get('input[name="confirmPassword"]').type(confirmPassword)
})

When('I submit register', () => {
  cy.get('form').submit()
})

When('I submit login', () => {
  cy.get('form').submit()
})

Then('I should redirect to login page', () => {
  cy.url().should('eq', Cypress.config('baseUrl') + '/login')
})

Then('I should see logout button', () => {
  cy.get('[data-cy="sign-out"]').should('be.visible')
})
