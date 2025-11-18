describe("First tests for App", () => {
    it("shows content in card", () => {
        cy.visit("/");
        cy.get('[data-cy="card-content"]').should("be.visible");
    });
    it("shows search bar", () => {
        cy.visit("/");
        cy.get('[data-cy="search-bar"]').should("be.visible");
    });
    it("shows logo of the site", () => {
        cy.visit("/");
        cy.get('[data-cy="logo"]').should("be.visible");
    });
    it("shows the album detail after clicking the first card button", () => {
        cy.visit("/");
        cy.get('[data-cy="card-content"]')
            .first()
            .within(() => {
                cy.get('[data-cy="detail"]').click();
            });
        cy.location("pathname").should("equal", "/album/1");
    });
    it("shows homepage after clicking the logo", () => {
        cy.visit("/");
        cy.get('[data-cy="logo"]').click();
        cy.location("pathname").should("equal", "/");
    });
    it("shows 'No search query' when nothing is searched in search bar", () => {
        cy.visit("/");
        cy.get('[data-cy="search-button"]').click();
        cy.contains("No Search query").should("be.visible");
    });
    it("shows results after searching with search bar", () => {
        const searchInput = "test";
        cy.visit("/");
        cy.get('[data-cy="search-bar"]').type(searchInput);
        cy.get('[data-cy="search-button"]').click();
        cy.location("search").should("equal", "?q=" + searchInput);
    });

    it("shows 'No results' when the search didn't find any results", () => {
        cy.visit("/");
        const searchInput = "asdad";
        cy.get('[data-cy="search-bar"]').type(searchInput);
        cy.get('[data-cy="search-button"]').click();
        cy.contains("No results").should("be.visible");
    });
    it("shows API info in first card", () => {
        it("shows data from api in first card", () => {
            cy.intercept("GET", "/api/albums", {
                statusCode: 200,
                body: [
                    {
                        id: 1,
                        name: "Mellon Collie And The Infinite Sadness",
                        author_name: "Zach Bryan"
                    }
                ]
            }).as("getAlbums");
            cy.visit("/");
            cy.wait("@getAlbums");
            cy.contains("Mellon Collie And The Infinite Sadness").should("be.visible");
        });
    });
    it("shows error message from api", () => {
        cy.intercept("GET", "/api/albums", {
            statusCode: 500,
            body: [{}]
        }).as("getAlbums");
        cy.visit("/");
        cy.wait("@getAlbums");
        cy.get("[data-cy='error']").should("be.visible");
    });
    it("displays Loading text and then dissapears when starting the app", () => {
        cy.visit("/");
        cy.intercept("GET", "/api/albums", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    name: "Mellon Collie And The Infinite Sadness",
                    author_name: "Zach Bryan"
                }
            ]
        }).as("getAlbums");
        cy.get('[data-cy="loading"]').should("be.visible");
        cy.wait(5000);
        cy.get('[data-cy="loading"]').should("not.exist");
        cy.wait("@getAlbums");
    });
});
