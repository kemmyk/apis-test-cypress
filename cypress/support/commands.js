Cypress.Commands.add("adminLogin", () => {
  return cy.request({
    method: "POST",
    url: `${Cypress.env("apiBaseUrl")}/user/admin/login`,
    body: {
      email: Cypress.env("adminEmail"),
      password: Cypress.env("adminPassword"),
    },
  }).then((res) => {
    expect(res.status).to.eq(200);

    const token = res.body?.data?.access_token;
    expect(token, "Admin auth token").to.exist;

    Cypress.env("adminAuthToken", token);
    return token;
  });
});

