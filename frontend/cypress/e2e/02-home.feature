Feature: Home Page

    Scenario: Visit Homepage
        Given I visit the home page
        When I accept the age consent
        Then I should see "Recent Updates"

    Scenario: Search for Manga and display results
        Given I visit the home page
        When I accept the age consent
        When I type "Sono Bisque" in the search input
        Then I should see a list of manga related to "Sono Bisque"

    Scenario: Navigate to Manga Search Results Page
        Given I visit the home page
        When I accept the age consent
        When I type "One Piece" in the search input
        Then I should be navigated to the manga search results page with "One Piece" in the URL