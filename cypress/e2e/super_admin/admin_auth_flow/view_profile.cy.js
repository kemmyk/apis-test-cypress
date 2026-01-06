describe("View Admin Profile API - All Test Cases (Final)", () => {

  const endpoint = `${Cypress.env("apiBaseUrl")}/user/admin/profile`;

  const getAuthHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
  });

  // 
  // POSITIVE CASE
  // 

  it("should view admin profile successfully", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "GET",
        url: endpoint,
        headers: getAuthHeaders(token),
      }).then((response) => {
        expect(response.status).to.eq(200);

        // Basic response validation
        expect(response.body).to.have.property("data");

        const profile = response.body.data;

        // Required fields (based on actual API response)
        expect(profile).to.have.property("email");
        expect(profile.email).to.be.a("string");

        // Optional fields (assert only if present)
        if (profile.name !== undefined) {
          expect(profile.name).to.be.a("string");
        }

        if (profile.phone_number !== undefined) {
          expect(profile.phone_number).to.be.a("string");
        }

        cy.log(JSON.stringify(response.body));
      });
    });
  });

  // 
  //  AUTHORIZATION CASES
  // 

  it("should return error when authorization token is missing", () => {
    cy.request({
      method: "GET",
      url: endpoint,
      failOnStatusCode: false,
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });

  it("should return error for invalid authorization token", () => {
    cy.request({
      method: "GET",
      url: endpoint,
      headers: {
        Authorization: "Bearer invalid.token.value",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });

  // 
  //  METHOD VALIDATION
  //

  it("should not allow POST method on view profile API", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "POST",
        url: endpoint,
        headers: getAuthHeaders(token),
        failOnStatusCode: false,
      }).then((response) => {
        expect([404, 405]).to.include(response.status);
      });
    });
  });

  it("should not allow PUT method on view profile API", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "PUT",
        url: endpoint,
        headers: getAuthHeaders(token),
        failOnStatusCode: false,
      }).then((response) => {
        expect([404, 405]).to.include(response.status);
      });
    });
  });

  it("should not allow DELETE method on view profile API", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "DELETE",
        url: endpoint,
        headers: getAuthHeaders(token),
        failOnStatusCode: false,
      }).then((response) => {
        expect([404, 405]).to.include(response.status);
      });
    });
  });

});
