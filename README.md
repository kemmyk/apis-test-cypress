ShallWe Play - Cypress API automation
Generated from your Postman collection. See notes below.

How to run:
1. cd /mnt/data/shallwe-cypress
2. npm install
3. npx cypress open   # or npm run cypress:open

Notes:
- baseUrl is set to: https://test.api.shallwe-play.com/user
- Use Cypress.env('adminAuthToken') for bearer-protected requests. The generated support/commands.js includes adminLogin helper.
- Some requests may need manual adjustments (file uploads, dynamic path variables).
- Tests created per Postman request; filenames mirror collection names.


