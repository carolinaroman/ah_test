export default {
  moduleNameMapper: {
    // Handle any static assets imports (CSS, images, etc)
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  // I want to run Jest in ESM mode, so do not transform
  transform: {},
  testEnvironment: "node",
  // Tests files will we named XXX.test.js
  testMatch: ["**/*.test.js"],
  verbose: true,
};
