describe("Admin Forgot Password - API Not Implemented", () => {
  const endpoint = `${Cypress.env("apiBaseUrl")}/user/admin/forgot-password`;

  // 1 Unregistered email
  it("should return 404 for unregistered email", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "notregistered@yopmail.com",
      },
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  // 2️ Registered email
  it("should return 404 for registered email", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "superadmin@yopmail.com",
      },
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  // 3️ Missing email field
  it("should return 404 when email is missing", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {},
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  // 4️ Empty email
  it("should return 404 when email is empty", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "",
      },
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  // 5️ Invalid email format
  it("should return 404 for invalid email format", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "invalid-email",
      },
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  // 6️ Email with spaces
  it("should return 404 for email with leading/trailing spaces", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "  admin@yopmail.com  ",
      },
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  // 7️ Uppercase email
  it("should return 404 for uppercase email", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "ADMIN@YOPMAIL.COM",
      },
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  // 8️ Special characters in email
  it("should return 404 for special character email", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "admin+test@yopmail.com",
      },
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  // 9️ GET method instead of POST
  it("should return 404 for GET method", () => {
    cy.request({
      method: "GET",
      url: endpoint,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  //  PUT method
  it("should return 404 for PUT method", () => {
    cy.request({
      method: "PUT",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "admin@yopmail.com",
      },
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  // 1️1️ DELETE method
  it("should return 404 for DELETE method", () => {
    cy.request({
      method: "DELETE",
      url: endpoint,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
