# cypress/e2e/duckduckgo.feature
Feature: Homepage

Scenario: Visit Homepage
    When I visit "/"
    Then I should see "ChaiyapatOam"