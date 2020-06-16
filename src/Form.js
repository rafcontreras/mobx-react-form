import { action, asMap, computed, observable } from "mobx";
import debounce from "lodash-es/debounce";
import each from "lodash-es/each";
import get from "lodash-es/get";
import head from "lodash-es/head";
import isArray from "lodash-es/isArray";
import isBoolean from "lodash-es/isBoolean";
import isDate from "lodash-es/isDate";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import isNil from "lodash-es/isNil";
import isNumber from "lodash-es/isNumber";
import isPlainObject from "lodash-es/isPlainObject";
import isString from "lodash-es/isString";
import isUndefined from "lodash-es/isUndefined";
import map from "lodash-es/map";
import merge from "lodash-es/merge";
import omit from "lodash-es/omit";
import set from "lodash-es/set";
import toNumber from "lodash-es/toNumber";
import toString from "lodash-es/toString";

import Base from "./Base";
import Validator from "./Validator";
import State from "./State";
import Field from "./Field";

export default class Form extends Base {
  name;
  state;
  validator;

  $hooks = {};
  $handlers = {};

  @observable $submitting = false;
  @observable $validating = false;

  @observable fields = observable.map ? observable.map({}) : asMap({});

  constructor(
    setup = {},
    {
      name = null,
      options = {},
      plugins = {},
      bindings = {},
      hooks = {},
      handlers = {},
    } = {}
  ) {
    super();

    this.name = name;
    this.$hooks = hooks;
    this.$handlers = handlers;

    // load data from initializers methods
    const initial = each(
      {
        setup,
        options,
        plugins,
        bindings,
      },
      (val, key) =>
        isFunction(this[key]) ? merge(val, this[key].apply(this, [this])) : val
    );

    this.state = new State({
      form: this,
      initial: initial.setup,
      options: initial.options,
      bindings: initial.bindings,
    });

    this.validator = new Validator({
      form: this,
      plugins: initial.plugins,
    });

    this.initFields(initial.setup);

    this.debouncedValidation = debounce(
      this.validate,
      this.state.options.get("validationDebounceWait"),
      this.state.options.get("validationDebounceOptions")
    );

    // execute validation on form initialization
    if (this.state.options.get("validateOnInit") === true) {
      this.validator.validate({
        showErrors: this.state.options.get("showErrorsOnInit"),
      });
    }

    this.execHook("onInit");
  }

  /* ------------------------------------------------------------------ */
  /* COMPUTED */

  @computed get validatedValues() {
    const data = {};
    this.each(
      (
        $field // eslint-disable-line
      ) => (data[$field.path] = $field.validatedValue)
    );

    return data;
  }

  @computed get clearing() {
    return this.check("clearing", true);
  }

  @computed get resetting() {
    return this.check("resetting", true);
  }

  @computed get error() {
    return this.validator.error;
  }

  @computed get hasError() {
    return !!this.validator.error || this.check("hasError", true);
  }

  @computed get isValid() {
    return !this.validator.error && this.check("isValid", true);
  }

  @computed get isPristine() {
    return this.check("isPristine", true);
  }

  @computed get isDirty() {
    return this.check("isDirty", true);
  }

  @computed get isDefault() {
    return this.check("isDefault", true);
  }

  @computed get isEmpty() {
    return this.check("isEmpty", true);
  }

  @computed get focused() {
    return this.check("focused", true);
  }

  @computed get touched() {
    return this.check("touched", true);
  }

  @computed get changed() {
    return this.check("changed", true);
  }

  @computed get disabled() {
    return this.check("disabled", true);
  }
}

/**
  Prototypes
*/
export const prototypes = {
  makeField(data) {
    return new Field(data);
  },

  /**
   Init Form Fields and Nested Fields
   */
  @action
  init($fields = null) {
    set(this, "fields", observable.map ? observable.map({}) : asMap({}));

    this.state.initial.props.values = $fields; // eslint-disable-line
    this.state.current.props.values = $fields; // eslint-disable-line

    this.initFields({
      fields: $fields || this.state.struct(),
    });
  },

  @action
  invalidate(message = null) {
    this.validator.error =
      message || this.state.options.get("defaultGenericError") || true;
  },

  showErrors(show = true) {
    this.each((field) => field.showErrors(show));
  },

  /**
    Clear Form Fields
  */
  @action
  clear() {
    this.$touched = false;
    this.$changed = false;
    this.each((field) => field.clear(true));
  },

  /**
    Reset Form Fields
  */
  @action
  reset() {
    this.$touched = false;
    this.$changed = false;
    this.each((field) => field.reset(true));
  },
};
