Feature: Search Page

    Scenario: Search Manga
        Given I visit the search page with "Bocchi The Rock" search
        When I accept the age consent
        Then I should see a list of manga related to "Bocchi The Rock"