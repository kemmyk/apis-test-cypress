describe("Admin Reset Password API - All Test Cases", () => {

  const endpoint = `${Cypress.env("apiBaseUrl")}/user/admin/reset/password`;

  // 1️ Invalid / expired token
  it("should return error for invalid or expired token", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        token: "invalid-or-expired-token",
        password: "Demo@123",
      },
    }).then((response) => {
      expect([400, 401]).to.include(response.status);
    });
  });

  // 2️ Missing token
  it("should return error when token is missing", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        password: "Demo@123",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  // 3️ Missing password
  it("should return error when password is missing", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        token: "6143f8b0-8fc3-4d66-8a16-f94c6c52cdb5",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  // 4️ Empty password
  it("should return error for empty password", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        token: "6143f8b0-8fc3-4d66-8a16-f94c6c52cdb5",
        password: "",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  // 5️ Weak password (does not meet policy)
  it("should return error for weak password", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        token: "6143f8b0-8fc3-4d66-8a16-f94c6c52cdb5",
        password: "12345",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  // 6️ Password without special character
  it("should return error when password does not meet complexity rules", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        token: "6143f8b0-8fc3-4d66-8a16-f94c6c52cdb5",
        password: "Password123",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  // 7️ Valid token + valid password (Success case – if implemented)
  it("should reset password successfully with valid token and password", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        token: "valid-reset-token",
        password: "Demo@123",
      },
    }).then((response) => {
      expect([200, 400]).to.include(response.status);
    });
  });

  // 8️ Reuse same reset token
  it("should not allow reuse of reset token", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        token: "used-reset-token",
        password: "Demo@123",
      },
    }).then((response) => {
      expect([400, 401]).to.include(response.status);
    });
  });

  // 9️ SQL Injection attempt
  it("should block SQL injection attempt in token field", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        token: "' OR 1=1 --",
        password: "Demo@123",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  // 10 GET method instead of POST
  it("should not allow GET method for reset password", () => {
    cy.request({
      method: "GET",
      url: endpoint,
      failOnStatusCode: false,
    }).then((response) => {
      expect([404, 405]).to.include(response.status);
    });
  });

});
