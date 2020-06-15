import filter from "lodash-es/filter";
import first from "lodash-es/first";
import forIn from "lodash-es/forIn";
import isEmpty from "lodash-es/isEmpty";
import isFunction from "lodash-es/isFunction";
import isString from "lodash-es/isString";
import split from "lodash-es/split";

/**
  Declarative Validation Rules

    const plugins = {
      dvr: dvr({
        package: validatorjs,
        extend: callback,
      }),
    };

*/
class DVR {
  promises = [];

  config = null;

  state = null;

  extend = null;

  validator = null;

  constructor({ config = {}, state = {}, promises = [] }) {
    this.state = state;
    this.promises = promises;
    this.extend = config.extend;
    this.validator = config.package || config;
    this.extendValidator();
  }

  extendValidator() {
    // extend using "extend" callback
    if (isFunction(this.extend)) {
      this.extend({
        validator: this.validator,
        form: this.state.form,
      });
    }
  }

  validateField(field) {
    // get form fields data
    const data = this.state.form.validatedValues;
    this.validateFieldAsync(field, data);
    this.validateFieldSync(field, data);
  }

  makeLabels(validation, field) {
    const labels = { [field.path]: field.label };
    forIn(validation.rules[field.path], (rule) => {
      if (
        typeof rule.value === "string" &&
        rule.name.match(/^(required_|same|different)/)
      ) {
        forIn(rule.value.split(","), (p, i) => {
          if (!rule.name.match(/^required_(if|unless)/) || i % 2 === 0) {
            const f = this.state.form.$(p);
            if (f && f.path && f.label) {
              labels[f.path] = f.label;
            }
          }
        });
      }
    });
    validation.setAttributeNames(labels);
  }

  validateFieldSync(field, data) {
    const $rules = this.rules(field.rules, "sync");
    // exit if no rules found
    if (isEmpty($rules[0])) return;
    // get field rules
    const rules = { [field.path]: $rules };
    // create the validator instance
    const validation = new this.validator(data, rules);
    // set label into errors messages instead key
    this.makeLabels(validation, field);
    // check validation
    if (validation.passes()) return;
    // the validation is failed, set the field error
    field.invalidate(first(validation.errors.get(field.path)));
  }

  validateFieldAsync(field, data) {
    const $rules = this.rules(field.rules, "async");
    // exit if no rules found
    if (isEmpty($rules[0])) return;
    // get field rules
    const rules = { [field.path]: $rules };
    // create the validator instance
    const validation = new this.validator(data, rules);
    // set label into errors messages instead key
    this.makeLabels(validation, field);

    const $p = new Promise((resolve) =>
      validation.checkAsync(
        () => this.handleAsyncPasses(field, resolve),
        () => this.handleAsyncFails(field, validation, resolve)
      )
    );

    this.promises.push($p);
  }

  handleAsyncPasses(field, resolve) {
    field.setValidationAsyncData(true);
    field.showAsyncErrors();
    resolve();
  }

  handleAsyncFails(field, validation, resolve) {
    field.setValidationAsyncData(
      false,
      first(validation.errors.get(field.path))
    );
    this.executeAsyncValidation(field);
    field.showAsyncErrors();
    resolve();
  }

  executeAsyncValidation(field) {
    if (field.validationAsyncData.valid === false) {
      field.invalidate(field.validationAsyncData.message, true);
    }
  }

  rules(rules, type) {
    const $rules = isString(rules) ? split(rules, "|") : rules;
    // eslint-disable-next-line new-cap
    const v = new this.validator();
    return filter($rules, ($rule) =>
      type === "async"
        ? v.getRule(split($rule, ":")[0]).async
        : !v.getRule(split($rule, ":")[0]).async
    );
  }
}

export default (config) => ({
  class: DVR,
  config,
});
