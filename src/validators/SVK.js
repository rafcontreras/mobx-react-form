import find from "lodash-es/find";
import get from "lodash-es/get";
import includes from "lodash-es/includes";
import isEmpty from "lodash-es/isEmpty";
import isFunction from "lodash-es/isFunction";
import isNaN from "lodash-es/isNaN";
import isNull from "lodash-es/isNull";
import isUndefined from "lodash-es/isUndefined";
import omitBy from "lodash-es/omitBy";
import trim from "lodash-es/trim";
import trimStart from "lodash-es/trimStart";

const isPromise = (obj) =>
  !!obj &&
  typeof obj.then === "function" &&
  (typeof obj === "object" || typeof obj === "function");

/**
  Schema Validation Keywords

    const plugins = {
      svk: svk({
        package: ajv,
        extend: callback,
      }),
    };

*/
class SVK {
  promises = [];

  config = null;

  state = null;

  extend = null;

  validator = null;

  schema = null;

  constructor({ config = {}, state = {}, promises = [] }) {
    this.state = state;
    this.promises = promises;
    this.extend = config.extend;
    this.schema = config.schema;
    this.initAJV(config);
  }

  extendOptions(options = {}) {
    return Object.assign(options, {
      allowRequired: get(options, "allowRequired") || false,
      errorDataPath: "property",
      allErrors: true,
      coerceTypes: true,
      v5: true,
    });
  }

  initAJV(config, form) {
    // get ajv package
    const ajv = config.package || config;
    // create ajv instance
    const validator = new ajv(this.extendOptions(config.options));
    // extend ajv using "extend" callback
    if (isFunction(this.extend)) {
      this.extend({
        form: this.state.form,
        validator,
      });
    }
    // create ajv validator (compiling rules)
    this.validator = validator.compile(this.schema);
  }

  validateField(field) {
    const data = { [field.path]: field.validatedValue };
    const validate = this.validator(this.parseValues(data));
    // check if is $async schema
    if (isPromise(validate)) {
      const $p = validate
        .then(() => field.setValidationAsyncData(true))
        .catch((err) => err && this.handleAsyncError(field, err.errors))
        .then(() => this.executeAsyncValidation(field))
        .then(() => field.showAsyncErrors());

      // push the promise into array
      this.promises.push($p);
      return;
    }
    // check sync errors
    this.handleSyncError(field, this.validator.errors);
  }

  handleSyncError(field, errors) {
    const fieldErrorObj = this.findError(field.key, errors);
    // if fieldErrorObj is not undefined, the current field is invalid.
    if (isUndefined(fieldErrorObj)) return;
    // the current field is now invalid
    // add additional info to the message
    const msg = `${field.label} ${fieldErrorObj.message}`;
    // invalidate the current field with message
    field.invalidate(msg);
  }

  handleAsyncError(field, errors) {
    // find current field error message from ajv errors
    const fieldErrorObj = this.findError(field.path, errors);
    // if fieldErrorObj is not undefined, the current field is invalid.
    if (isUndefined(fieldErrorObj)) return;
    // the current field is now invalid
    // add additional info to the message
    const msg = `${field.label} ${fieldErrorObj.message}`;
    // set async validation data on the field
    field.setValidationAsyncData(false, msg);
  }

  findError(path, errors) {
    return find(errors, ({ dataPath }) => {
      let $dataPath;
      $dataPath = trimStart(dataPath, ".");
      $dataPath = trim($dataPath, "['");
      $dataPath = trim($dataPath, "']");
      return includes($dataPath, `${path}`);
    });
  }

  executeAsyncValidation(field) {
    if (field.validationAsyncData.valid === false) {
      field.invalidate(field.validationAsyncData.message, true);
    }
  }

  parseValues(values) {
    if (get(this.config, "options.allowRequired") === true) {
      return omitBy(values, isEmpty || isNull || isUndefined || isNaN);
    }
    return values;
  }
}

export default (config) => ({
  class: SVK,
  config,
});
