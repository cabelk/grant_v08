// Playwright Test configuration
module.exports = {
  testDir: 'e2e/tests',
  timeout: 30000,
  use: {
    headless: true,
    baseURL: 'http://localhost:3000',
    actionTimeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    }
  ]
};
