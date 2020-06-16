import { action, observable } from "mobx";
import each from "lodash-es/each";
import get from "lodash-es/get";
import has from "lodash-es/has";
import isNil from "lodash-es/isNil";
import isString from "lodash-es/isString";
import map from "lodash-es/map";
import merge from "lodash-es/merge";

import { $try } from "./utils";

export default class Validator {
  promises = [];

  form = {};

  options = {};

  drivers = {};

  plugins = {
    vjf: undefined,
    dvr: undefined,
    svk: undefined,
    yup: undefined,
  };

  @observable error = null;

  constructor(obj = {}) {
    merge(this.plugins, obj.plugins);
    this.form = obj.form;

    this.initDrivers();
    this.checkSVKValidationPlugin();
  }

  initDrivers() {
    map(
      this.plugins,
      (driver, key) =>
        (this.drivers[key] =
          driver &&
          has(driver, "class") &&
          new driver.class({
            config: driver.config,
            state: this.form.state,
            promises: this.promises,
          }))
    );
  }

  @action
  validate(opt = {}, obj = {}) {
    const path = $try(opt.path, opt);
    const field = $try(opt.field, this.form.select(path, null, null));
    const related = $try(opt.related, obj.related, true);
    const showErrors = $try(opt.showErrors, obj.showErrors, false);
    const instance = field || this.form;
    instance.$validating = true;
    instance.$validated += 1;

    this.error = null;

    return new Promise((resolve) => {
      // validate instance (form or filed)
      if (instance.path || isString(path)) {
        this.validateField({
          field: instance,
          showErrors,
          related,
          path,
        });
      }

      // validate nested fields
      instance.each(($field) =>
        this.validateField({
          path: $field.path,
          field: $field,
          showErrors,
          related,
        })
      );

      // wait all promises
      resolve(Promise.all(this.promises));
    })
      .then(
        action(() => {
          instance.$validating = false;
          instance.$clearing = false;
          instance.$resetting = false;
        })
      )
      .catch(
        action((err) => {
          instance.$validating = false;
          instance.$clearing = false;
          instance.$resetting = false;
          throw err;
        })
      )
      .then(() => instance);
  }

  @action
  validateField({ showErrors = false, related = false, field = null, path }) {
    const instance = field || this.form.select(path);
    // check if the field is a valid instance
    if (!instance.path)
      throw new Error("Validation Error: Invalid Field Instance");
    // do not validate soft deleted fields
    if (
      instance.deleted &&
      !this.form.state.options.get("validateDeletedFields")
    )
      return;
    // do not validate disabled fields
    if (
      instance.disabled &&
      !this.form.state.options.get("validateDisabledFields")
    )
      return;
    // do not validate pristine fields
    if (
      instance.isPristine &&
      !this.form.state.options.get("validatePristineFields")
    )
      return;
    // reset field validation
    instance.resetValidation();
    // validate with all enabled drivers
    each(this.drivers, (driver) => driver && driver.validateField(instance));
    // send error to the view
    instance.showErrors(showErrors);
    // related validation
    if (related) this.relatedFieldValidation(instance, showErrors);
  }

  /**
    Validate 'related' fields if specified
    and related validation allowed (recursive)
  */
  relatedFieldValidation(field, showErrors) {
    if (!field.related || !field.related.length) return;

    each(field.related, (path) =>
      this.validateField({
        related: false,
        showErrors,
        path,
      })
    );
  }

  checkSVKValidationPlugin() {
    if (isNil(this.drivers.svk) && get(this.plugins, "svk.config.schema")) {
      const form = this.state.form.name ? `Form: ${this.state.form.name}` : "";
      throw new Error(
        `The SVK validation schema is defined but no plugin provided (SVK). ${form}`
      );
    }
  }
}
