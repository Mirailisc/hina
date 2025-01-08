import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

Then('I should see {string}', (text: string) => {
  cy.contains(text).should('be.visible')
})

When('I accept the age consent', () => {
  cy.get('button[data-cy="accept-age-consent"]').click()
})
