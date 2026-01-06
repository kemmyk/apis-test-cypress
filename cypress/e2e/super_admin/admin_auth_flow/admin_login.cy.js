describe("Admin Login API - All Test Cases", () => {

  const endpoint = `${Cypress.env("apiBaseUrl")}/user/admin/login`;

  // 1️ Valid admin login (Positive)
  it("should login successfully with valid credentials", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      body: {
        email: "superadmin@yopmail.com",
        password: "Test@123",
      },
    }).then((response) => {
      // status check
      expect(response.status).to.eq(200);

      // response structure check
      expect(response.body).to.have.property("data");

      // admin profile validation
      expect(response.body.data).to.have.property("id");
      expect(response.body.data).to.have.property("email");
    });
  });

  // 2️ Incorrect password
  it("should return error for incorrect password", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "superadmin@yopmail.com",
        password: "WrongPassword",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  // 3️ Unregistered email
  it("should return error for unregistered email", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "unknown@yopmail.com",
        password: "Test@123",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  // 4️ Missing email
  it("should return error when email is missing", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        password: "Test@123",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  // 5️ Missing password
  it("should return error when password is missing", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "superadmin@yopmail.com",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  // 6️ Empty email and password
  it("should return error for empty email and password", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "",
        password: "",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  // 7️ Invalid email format
  it("should return error for invalid email format", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "invalid-email",
        password: "Test@123",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  // 8️ Email with leading/trailing spaces
  it("should handle email with spaces", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "  superadmin@yopmail.com  ",
        password: "Test@123",
      },
    }).then((response) => {
      expect([200, 400]).to.include(response.status);
    });
  });

  // 9️ Uppercase email
  it("should login with uppercase email", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      body: {
        email: "SUPERADMIN@YOPMAIL.COM",
        password: "Test@123",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  // 10 Special characters in email
  it("should handle special character email", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "superadmin+test@yopmail.com",
        password: "Test@123",
      },
    }).then((response) => {
      expect([200, 400]).to.include(response.status);
    });
  });

  // 1️1️ SQL Injection attempt
  it("should block SQL injection attempt", () => {
    cy.request({
      method: "POST",
      url: endpoint,
      failOnStatusCode: false,
      body: {
        email: "' OR 1=1 --",
        password: "' OR 1=1 --",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  // 1️2️ GET method instead of POST
  it("should not allow GET method", () => {
    cy.request({
      method: "GET",
      url: endpoint,
      failOnStatusCode: false,
    }).then((response) => {
      expect([404, 405]).to.include(response.status);
    });
  });

  // 1️3️ Multiple failed login attempts
  it("should return 400 for multiple failed login attempts", () => {
    for (let i = 0; i < 3; i++) {
      cy.request({
        method: "POST",
        url: endpoint,
        failOnStatusCode: false,
        body: {
          email: "superadmin@yopmail.com",
          password: "WrongPassword",
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    }
  });

});
