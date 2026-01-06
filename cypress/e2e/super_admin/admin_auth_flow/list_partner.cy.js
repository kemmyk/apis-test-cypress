describe("List Partner API - All Test Cases", () => {

  const baseUrl = Cypress.env("apiBaseUrl");
  const endpoint = `${baseUrl}/user/admin/partners`;

  /**
   * Helper to build auth headers
   */
  const getAuthHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
  });

  // 
  // POSITIVE TEST CASES
  // 

  const validStatuses = ["active", "inactive", "pending"];

  validStatuses.forEach((status) => {
    it(`should list partners with status=${status}`, () => {
      cy.adminLogin().then((token) => {
        cy.request({
          method: "GET",
          url: `${endpoint}?status=${status}`,
          headers: getAuthHeaders(token),
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property("data");
        });
      });
    });
  });

  it("should list partners without status filter", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "GET",
        url: endpoint,
        headers: getAuthHeaders(token),
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("data");
      });
    });
  });

  // 
  //  NEGATIVE TEST CASES
  //

  it("should return 400 for invalid partner status (rejected)", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "GET",
        url: `${endpoint}?status=rejected`,
        headers: getAuthHeaders(token),
        failOnStatusCode: false, // IMPORTANT
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq("AFP001");
        expect(response.body.error).to.include(
          "Status must be one of: active, inactive, pending"
        );
      });
    });
  });

  it("should return 400 for completely invalid status", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "GET",
        url: `${endpoint}?status=invalidStatus`,
        headers: getAuthHeaders(token),
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  it("should return error when authorization token is missing", () => {
    cy.request({
      method: "GET",
      url: `${endpoint}?status=pending`,
      failOnStatusCode: false,
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });

  it("should return error for invalid authorization token", () => {
    cy.request({
      method: "GET",
      url: `${endpoint}?status=pending`,
      headers: {
        Authorization: "Bearer invalid.token.value",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });

  //
  //  SECURITY & METHOD VALIDATION
  // 

  it("should block SQL injection attempt in status query", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "GET",
        url: `${endpoint}?status=' OR 1=1 --`,
        headers: getAuthHeaders(token),
        failOnStatusCode: false,
      }).then((response) => {
        expect([400, 404]).to.include(response.status);
      });
    });
  });

  it("should not allow POST method for list partners", () => {
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

});
