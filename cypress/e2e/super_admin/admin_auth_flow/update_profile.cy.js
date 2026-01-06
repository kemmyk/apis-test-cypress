describe("Update Admin Profile API - All Test Cases (Final)", () => {

  const endpoint = `${Cypress.env("apiBaseUrl")}/user/admin/profile/update`;

  const getAuthHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
  });

  // 
  //  POSITIVE CASES
  // 

  it("should update admin profile with name and phone number", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "PUT",
        url: endpoint,
        headers: getAuthHeaders(token),
        body: {
          phone_number: "+91123456789",
          name: "Super Admin",
        },
      }).then((response) => {
        expect([200, 201, 204]).to.include(response.status);

        // Body may be empty for 204
        if (response.body) {
          expect(response.body).to.have.property("status");
          expect(response.body).to.have.property("message");
        }
      });
    });
  });

  it("should update admin profile with only name", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "PUT",
        url: endpoint,
        headers: getAuthHeaders(token),
        body: {
          name: "Updated Admin Name",
        },
      }).then((response) => {
        expect([200, 201, 204]).to.include(response.status);
      });
    });
  });

  it("should update admin profile with only phone number", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "PUT",
        url: endpoint,
        headers: getAuthHeaders(token),
        body: {
          phone_number: "+919876543210",
        },
      }).then((response) => {
        expect([200, 201, 204]).to.include(response.status);
      });
    });
  });

  it("should allow empty request body and return success", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "PUT",
        url: endpoint,
        headers: getAuthHeaders(token),
        body: {}, // backend allows no-change update
      }).then((response) => {
        expect([200, 204]).to.include(response.status);
      });
    });
  });

  //
  //  VALIDATION / NEGATIVE CASES
  // 

  it("should return error for invalid phone number format", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "PUT",
        url: endpoint,
        headers: getAuthHeaders(token),
        failOnStatusCode: false,
        body: {
          phone_number: "12345",
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  it("should return error when name is empty string", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "PUT",
        url: endpoint,
        headers: getAuthHeaders(token),
        failOnStatusCode: false,
        body: {
          name: "",
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  // 
  //  AUTHORIZATION CASES
  // 

  it("should return error when authorization token is missing", () => {
    cy.request({
      method: "PUT",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        name: "Admin",
      },
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });

  it("should return error for invalid authorization token", () => {
    cy.request({
      method: "PUT",
      url: endpoint,
      headers: {
        Authorization: "Bearer invalid.token.value",
      },
      failOnStatusCode: false,
      body: {
        name: "Admin",
      },
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });

  //
  //  SECURITY CASES
  // 

  it("should block SQL injection attempt in profile fields", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "PUT",
        url: endpoint,
        headers: getAuthHeaders(token),
        failOnStatusCode: false,
        body: {
          name: "' OR 1=1 --",
          phone_number: "' OR 1=1 --",
        },
      }).then((response) => {
        expect([400, 422]).to.include(response.status);
      });
    });
  });

  //
  //  METHOD VALIDATION
  //

  it("should not allow GET method for update profile", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "GET",
        url: endpoint,
        headers: getAuthHeaders(token),
        failOnStatusCode: false,
      }).then((response) => {
        expect([404, 405]).to.include(response.status);
      });
    });
  });

});
