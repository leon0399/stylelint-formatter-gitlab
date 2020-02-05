const crypto = require('crypto')
const path = require('path')

const fs = require('fs-extra')
const isGlob = require('is-glob')
const yaml = require('js-yaml')

const { formatters } = require('stylelint')

const {
  // Used as a fallback for local testing.
  CI_CONFIG_PATH = '.gitlab-ci.yml',
  CI_JOB_NAME,
  CI_PROJECT_DIR = process.cwd(),
  STYLELINT_CODE_QUALITY_REPORT,
  STYLELINT_FORMATTER = 'string'
} = process.env

function getOutputPath() {
  const jobs = yaml.load(fs.readFileSync(path.join(CI_PROJECT_DIR, CI_CONFIG_PATH), 'utf-8'))
  const { artifacts } = jobs[CI_JOB_NAME]
  const location = artifacts && artifacts.reports && artifacts.reports.codequality
  const msg = `Expected ${CI_JOB_NAME}.artifacts.reports.codequality to be one exact path`
  if (location == null) {
    throw new Error(`${msg}, but no value was found.`)
  }
  if (Array.isArray(location)) {
    throw new Error(`${msg}, but found an array instead.`)
  }
  if (typeof location !== 'string') {
    throw new Error(`${msg}, but found ${JSON.stringify(location)} instead.`)
  }
  if (isGlob(location)) {
    throw new Error(`${msg}, but found a glob instead.`)
  }
  return path.resolve(CI_PROJECT_DIR, location)
}

function createFingerprint(filePath, message) {
  const md5 = crypto.createHash('md5')
  md5.update(filePath)
  if (message.rule) {
    md5.update(message.rule)
  }
  md5.update(message.text)
  return md5.digest('hex')
}

/**
 * @param {import('stylelint').Warning[]} messages
 * @param {string} source
 * @return {string}
 */
function formatter(results, source) {
  const relativePath = path.relative(CI_PROJECT_DIR, source)
  return results.map((result) => ({
    description: result.text,
    fingerprint: createFingerprint(relativePath, result),
    location: {
      path: relativePath,
      lines: {
        begin: result.line
      }
    }
  }))
}

/**
 * @param {import('stylelint').LintResult[]} results
 * @returns {Object[]}
 */
function convert(results) {
  return results.reduce((acc, result) => [...acc, ...formatter(result.warnings, result.source)], [])
}

/**
 * @param {import('stylelint').LintResult[]} results
 * @returns {string}
 */
module.exports = (results) => {
  if (CI_JOB_NAME || STYLELINT_CODE_QUALITY_REPORT) {
    fs.outputJsonSync(STYLELINT_CODE_QUALITY_REPORT || getOutputPath(), convert(results), {
      spaces: 2
    })
  }

  return formatters[STYLELINT_FORMATTER](results)
}

module.exports.getOutputPath = getOutputPath
module.exports.createFingerprint = createFingerprint
module.exports.convert = convert
