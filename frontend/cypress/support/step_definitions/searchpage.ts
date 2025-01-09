import { Given } from '@badeball/cypress-cucumber-preprocessor'

Given('I visit the search page with {string} search', (searchTerm: string) => {
  cy.visit(`/search/${encodeURI(searchTerm.toLocaleLowerCase())}`)
})
