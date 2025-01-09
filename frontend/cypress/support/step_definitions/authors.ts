import { Given, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('I visit the authors page', () => {
  cy.visit('/authors')
})

Then('I should see a list of authors', () => {
  cy.get('[data-cy="author"]')
    .should('have.length.at.least', 1)
    .each(($tag) => {
      cy.wrap($tag).should('be.visible')
    })
})
