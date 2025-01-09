import { Given, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('I visit the tags page', () => {
  cy.visit('/tags')
})

Then('I should see a list of tags', () => {
  cy.get('[data-cy="tag"]')
    .should('have.length.at.least', 1)
    .each(($tag) => {
      cy.wrap($tag).should('be.visible')
    })
})
