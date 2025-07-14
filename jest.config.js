export default async () => {
  return {
    cache: false,
    verbose: true,
    testMatch: ["<rootDir>/test/**/*.test.js"],
    modulePaths: ["<rootDir>"],
    setupFilesAfterEnv: ["<rootDir>/test/support/setup.js"],
    // transform: {},
    testEnvironment: "jsdom",
  };
};
