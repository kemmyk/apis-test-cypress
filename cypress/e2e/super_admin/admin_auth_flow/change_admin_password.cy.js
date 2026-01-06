describe("Change Admin Password API - All Test Cases", () => {

  const endpoint = `${Cypress.env("apiBaseUrl")}/user/admin/change/password`;

  // 1️ Incorrect old password (Negative)
  it("should return error for incorrect old password", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "POST",
        url: endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
        body: {
          oldPassword: "WRONG_OLD_PASSWORD",
          password: "NewStrong@123",
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body?.message).to.eq("AUTH002");
      });
    });
  });

  // 2️ Missing old password
  it("should return error when old password is missing", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "POST",
        url: endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
        body: {
          password: "NewStrong@123",
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  // 3️ Missing new password
  it("should return error when new password is missing", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "POST",
        url: endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
        body: {
          oldPassword: "CORRECT_OLD_PASSWORD",
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  // 4️ Empty old & new password
  it("should return error for empty old and new password", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "POST",
        url: endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
        body: {
          oldPassword: "",
          password: "",
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  // 5️ Weak new password
  it("should return error for weak new password", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "POST",
        url: endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
        body: {
          oldPassword: "CORRECT_OLD_PASSWORD",
          password: "12345",
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  // 6️ New password same as old password
  it("should return error when new password is same as old password", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "POST",
        url: endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
        body: {
          oldPassword: "CORRECT_OLD_PASSWORD",
          password: "CORRECT_OLD_PASSWORD",
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  // 7️ Missing Authorization token
  it("should return error when authorization token is missing", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        oldPassword: "CORRECT_OLD_PASSWORD",
        password: "NewStrong@123",
      },
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });

  // 8️ Invalid Authorization token
  it("should return error for invalid authorization token", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      headers: {
        Authorization: "Bearer invalid.token.value",
      },
      failOnStatusCode: false,
      body: {
        oldPassword: "CORRECT_OLD_PASSWORD",
        password: "NewStrong@123",
      },
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });

  // 9️ SQL Injection attempt
  it("should block SQL injection attempt", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "POST",
        url: endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
        body: {
          oldPassword: "' OR 1=1 --",
          password: "' OR 1=1 --",
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  // 10 GET method instead of POST
  it("should not allow GET method", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "GET",
        url: endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect([404, 405]).to.include(response.status);
      });
    });
  });

});
