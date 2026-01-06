
ShallWe Play – Cypress API Automation Framework
=============================================

This repository contains Cypress-based API automation test scripts for the ShallWe Play backend APIs.
The framework is generated from the Postman collection and enhanced to support authentication,
environment handling, reusable commands, and scalable test structure.

----------------------------------------------------------------

Project Overview
----------------

Framework: Cypress (API Automation)  
API Type: REST APIs  
Environment: Test  

Base URL:
https://test.api.shallwe-play.com/user

Purpose:
- Backend API validation
- Regression testing
- API contract verification
- Reduce dependency on UI testing

----------------------------------------------------------------

Tech Stack
----------

- Cypress
- Node.js
- npm
- JavaScript

----------------------------------------------------------------

Folder Structure
----------------

shallwe-cypress/
├── cypress/
│   ├── e2e/
│   │   ├── admin/
│   │   ├── customer/
│   │   ├── merchant/
│   │   └── webhook/
│   ├── fixtures/
│   └── support/
│       ├── commands.js
│       └── e2e.js
├── cypress.config.js
├── package.json
└── README.md

----------------------------------------------------------------

How to Run the Project
----------------------

Prerequisites:
- Node.js (v16 or higher)
- npm
- Git

Step 1: Extract the ZIP
unzip shallwe-cypress.zip  
cd shallwe-cypress  

Step 2: Install Dependencies
npm install

Step 3: Run Tests

Open Cypress Test Runner:
npx cypress open

Run all tests in headless mode:
npx cypress run

Run a specific spec file:
npx cypress run --spec cypress/e2e/admin/admin_login.cy.js

----------------------------------------------------------------

Authentication Handling
-----------------------

Some APIs are protected using Bearer token authentication.

Admin login helper is implemented in:
cypress/support/commands.js

Example usage:

cy.adminLogin().then((token) => {
  // use token for authenticated requests
});

Token can also be accessed using:
Cypress.env('adminAuthToken')

----------------------------------------------------------------

Environment Configuration
-------------------------

The base URL is configured in:
cypress.config.js

----------------------------------------------------------------

Test Design Approach
--------------------

- One spec file per API or feature
- Positive and negative test scenarios
- HTTP status code validation
- Response body structure validation
- Reusable authentication logic

----------------------------------------------------------------

Postman to Cypress Conversion Notes
----------------------------------

- Each Postman request is converted into a Cypress test case
- File names mirror the Postman collection structure
- Some APIs may require manual updates for:
  - Dynamic IDs
  - File uploads
  - Custom headers

----------------------------------------------------------------

Known Limitations
-----------------

- File upload APIs may need additional handling
- Webhook APIs require valid external triggers
- Some test cases depend on existing test data

----------------------------------------------------------------

Troubleshooting
---------------

401 Unauthorized:
- Ensure adminLogin() is executed
- Verify the token is passed correctly in request headers

Environment variable undefined:
- Check cypress.config.js
- Restart Cypress after configuration changes

No spec files found:
- Verify files exist under cypress/e2e/

----------------------------------------------------------------

Ownership and Maintenance
-------------------------

Automation Type: Backend API Automation  
Maintained By: QA Team  

Execution Use Cases:
- Regression testing
- Pre-release validation
- Bug verification
