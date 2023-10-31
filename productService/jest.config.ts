export default {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [ "<rootDir>/src/"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}'
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  modulePaths: [
    "<rootDir>"
  ],
  moduleNameMapper: {
    '@/(.*)$': "<rootDir>/src/$1"
  }
}
