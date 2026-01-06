const SERVICE_BASE_URL = {
     admin: () => Cypress.env("base_url_admin"),
     booking: () => Cypress.env("base_url_booking"),
     payment: () => Cypress.env("base_url_payment"),
   };
   
   Cypress.Commands.add("apiRequest", (service, method, path, body = null, headers = {}) => {
     const baseUrlFn = SERVICE_BASE_URL[service];
   
     if (!baseUrlFn) {
       throw new Error(`Unknown service: ${service}`);
     }
   
     const url = `${baseUrlFn()}${path}`;
   
     return cy.request({
       method,
       url,
       body,
       headers,
       failOnStatusCode: false,
     });
   });
   