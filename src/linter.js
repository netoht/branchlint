import util from './util.js';

export class Linter {
  constructor(config) {
    this.options = config.options;
  }

  // eslint-disable-next-line max-lines-per-function
  lint(branchName) {
    if (this.isAllowed(branchName)) {
      return true;
    }

    const validations = [
      { type: 'prefix', isValid: this.validatePrefix(branchName) },
      { type: 'disallowed', isValid: this.validateDisallowedName(branchName) },
      { type: 'regex', isValid: this.validateRegex(branchName) },
      { type: 'separator', isValid: this.validateSeparator(branchName) },
      { type: 'sections', isValid: this.validateSections(branchName) },
    ];

    this.printErrors(validations, branchName);

    const somethingError = validations?.some(validation => {
      return !validation.isValid;
    });

    if (somethingError) {
      process.exitCode = 1;
      return false;
    }

    return true;
  }

  isAllowed(branchName) {
    if (this.options?.allowed?.includes(branchName)) {
      util.log('valid branch name');
      return true;
    }

    return false;
  }

  printErrors(validations, branchName) {
    if (!this.options.quiet) {
      validations?.forEach(validation => {
        if (!validation.isValid) {
          util.printErrorMessage(this.options, validation.type, branchName);
        }
      });
    }
  }

  validatePrefix(branchName) {
    const { prefixes, separator } = this.options;

    if (prefixes.length === 0) {
      return true;
    }

    return prefixes?.some(prefix => {
      const regex = new RegExp(`^${prefix}${separator}`);
      return branchName.match(regex);
    });
  }

  validateDisallowedName(branchName) {
    const { disallowed } = this.options;

    if (disallowed.length === 0) {
      return true;
    }

    return !disallowed?.some(name => {
      const regex = new RegExp(`^${name}$`);
      return branchName.match(regex);
    });
  }

  validateRegex(branchName) {
    const { regularExpressions } = this.options;

    if (regularExpressions.length === 0) {
      return true;
    }

    return regularExpressions.some(regularExpression => {
      const regex = new RegExp(regularExpression);
      return branchName.match(regex);
    });
  }

  validateSeparator(branchName) {
    const { separator } = this.options;
    if (!separator || separator === '') {
      return true;
    }

    const regex = new RegExp(`^.*${separator}.*`);
    return branchName.match(regex) !== null;
  }

  validateSections(branchName) {
    const { separator, maxSections } = this.options;
    const splited = branchName.split(separator);

    if (!separator || !maxSections) {
      return true;
    }

    if (splited.length > maxSections) {
      return false;
    }

    return true;
  }
}

export default {
  Linter,
};
