describe("Check Auth Token Apis", () => {
  it("should Check Auth Token Apis", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiBaseUrl")}/user/admin/check/token`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
      });
    });
  });
});
