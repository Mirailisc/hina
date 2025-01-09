import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'

Given('I visit the home page', () => {
  cy.visit('/')
})

When('I type {string} in the search input', (searchTerm: string) => {
  cy.get('input[data-cy="search"]').clear().type(searchTerm)
})

Then('I should see a list of manga related to {string}', (searchTerm: string) => {
  cy.wait(1000)
  cy.contains(searchTerm).should('be.visible')
})

Then('I should be navigated to the manga search results page with {string} in the URL', (searchTerm: string) => {
  cy.wait(1000)
  cy.url().should('include', encodeURI(searchTerm.toLowerCase()))
})
