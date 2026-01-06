describe("Get My Profile", () => {
  it("should Get My Profile", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiBaseUrl")}/user/admin/profile`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("data");
        cy.log(JSON.stringify(response.body));
      });
    });
  });
});
