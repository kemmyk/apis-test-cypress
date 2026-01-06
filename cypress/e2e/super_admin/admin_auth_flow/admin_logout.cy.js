describe("Admin Logout API - All Test Cases", () => {

  const endpoint = `${Cypress.env("apiBaseUrl")}/user/admin/logout`;

  // 1️ Successful logout (Valid token)
  it("should logout admin successfully with valid token", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "POST",
        url: endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  // 2️ Logout without token
  it("should return error when token is missing", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
    }).then((response) => {
      expect([400, 401]).to.include(response.status);
    });
  });

  // 3️ Logout with invalid token
  it("should return error for invalid token", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      headers: {
        Authorization: "Bearer invalidtoken123",
      },
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });

  // 4️ Logout with expired token
  it("should return error for expired token", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      headers: {
        Authorization: "Bearer expired.token.value",
      },
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });

  // 5️ Logout twice using same token
  it("should handle logout with already logged out token", () => {
    cy.adminLogin().then((token) => {
      // First logout
      cy.request({
        method: "POST",
        url: endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });

      // Second logout with same token
      cy.request({
        method: "POST",
        url: endpoint,
        failOnStatusCode: false,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect([200, 401]).to.include(response.status);
      });
    });
  });

  // 6️ GET method instead of POST
  it("should not allow GET method for logout", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "GET",
        url: endpoint,
        failOnStatusCode: false,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect([404, 405]).to.include(response.status);
      });
    });
  });

});
