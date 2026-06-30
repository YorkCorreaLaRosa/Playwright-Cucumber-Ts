module.exports = {
  default: {
    parallel: 2,
    formatOptions: {
      snippetInterface: 'async-await'
    },
    paths: [
      'features/**/*.feature'
    ],
    require: [
      'src/step-definitions/**/*.ts',
      'src/support/**/*.ts'
    ],
    requireModule: [
      'ts-node/register'
    ],
    format: [
      '@serenity-js/cucumber',
      'junit:reports/junit-results.xml'
    ]
  }
};
