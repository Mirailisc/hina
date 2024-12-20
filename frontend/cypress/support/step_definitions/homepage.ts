import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

When('I visit {string}', (pathname: string) => {
  cy.visit(pathname)
})

Then('I should see {string}', (text: string) => {
  cy.contains(text).should('be.visible')
})
