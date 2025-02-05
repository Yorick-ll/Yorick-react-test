module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '^.+\\.svg$': '<rootDir>/src/__mocks__/svgMock.js',
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  }
}