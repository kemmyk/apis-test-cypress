describe("Get Partner - Dynamic Type from List (All Test Cases)", () => {

  const baseUrl = Cypress.env("apiBaseUrl");
  const listEndpoint = `${baseUrl}/user/admin/partners`;

  /**
   * Helper: fetch one valid partner dynamically
   */
  const getOnePartner = (headers) => {
    return cy.request({
      method: "GET",
      url: listEndpoint,
      headers,
    }).then((listRes) => {
      expect(listRes.status).to.eq(200);
      expect(listRes.body).to.have.property("data");

      const data = listRes.body.data;
      let list;

      if (Array.isArray(data)) {
        list = data;
      } else if (typeof data === "object") {
        list = Object.values(data).find((v) => Array.isArray(v));
      }

      expect(list, "partners list array not found")
        .to.be.an("array")
        .and.not.be.empty;

      const partner = list[0];
      expect(partner).to.have.property("id");
      expect(partner).to.have.property("type");

      return partner;
    });
  };

  // 1️ Get partner details using dynamic type & id (Positive)
  it("should get partner details using dynamic type and id", () => {
    cy.adminLogin().then((token) => {
      const headers = { Authorization: `Bearer ${token}` };

      getOnePartner(headers).then(({ id, type }) => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/user/admin/partners/${type}/${id}`,
          headers,
        }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.have.property("data");
        });
      });
    });
  });

  // 2️ Invalid partner ID
  it("should return error for invalid partner id", () => {
    cy.adminLogin().then((token) => {
      const headers = { Authorization: `Bearer ${token}` };

      cy.request({
        method: "GET",
        url: `${baseUrl}/user/admin/partners/vendor/invalid-id-123`,
        headers,
        failOnStatusCode: false,
      }).then((res) => {
        expect([400, 404]).to.include(res.status);
      });
    });
  });

  // 3️ Invalid partner type
  it("should return error for invalid partner type", () => {
    cy.adminLogin().then((token) => {
      const headers = { Authorization: `Bearer ${token}` };

      cy.request({
        method: "GET",
        url: `${baseUrl}/user/admin/partners/invalidType/123`,
        headers,
        failOnStatusCode: false,
      }).then((res) => {
        expect([400, 404]).to.include(res.status);
      });
    });
  });

  // 4️ Missing partner ID
  it("should return error when partner id is missing", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/user/admin/partners/vendor`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect([404, 405]).to.include(res.status);
      });
    });
  });

  // 5️ Missing Authorization token
  it("should return error when authorization token is missing", () => {
    cy.request({
      method: "GET",
      url: listEndpoint,
      failOnStatusCode: false,
    }).then((res) => {
      expect([401, 403]).to.include(res.status);
    });
  });

  // 6️ Invalid Authorization token
  it("should return error for invalid authorization token", () => {
    cy.request({
      method: "GET",
      url: listEndpoint,
      headers: {
        Authorization: "Bearer invalid.token.value",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect([401, 403]).to.include(res.status);
    });
  });

  // 7️ Empty partners list handling
  it("should handle empty partners list gracefully", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "GET",
        url: listEndpoint,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("data");

        const data = res.body.data;
        const list = Array.isArray(data)
          ? data
          : Object.values(data).find((v) => Array.isArray(v));

        // Valid even if empty — just assert array
        expect(list).to.be.an("array");
      });
    });
  });

  // 8️ GET method validation (list endpoint)
  it("should not allow POST method on partners list", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "POST",
        url: listEndpoint,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect([404, 405]).to.include(res.status);
      });
    });
  });

  // 9️ SQL Injection attempt in path params
  it("should block SQL injection attempt in partner path params", () => {
    cy.adminLogin().then((token) => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/user/admin/partners/vendor/' OR 1=1 --`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect([400, 404]).to.include(res.status);
      });
    });
  });

});
