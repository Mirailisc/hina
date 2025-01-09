Feature: Authors Page

    Scenario: Visit Authors page
        Given I visit the authors page
        When I accept the age consent
        Then I should see a list of authors