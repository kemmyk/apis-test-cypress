const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "spec",
  e2e: {
    baseUrl: "https://test.api.shallwe-play.com",

    setupNodeEvents(on, config) {
      require("@shelex/cypress-allure-plugin/writer")(on, config);
      return config;
    },
  },

  env: {
    allure: true,
    apiBaseUrl: "https://test.api.shallwe-play.com",
    adminEmail: "superadmin@yopmail.com",
    adminPassword: "Test@123",
  },
});
