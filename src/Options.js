import { action, extendObservable, observable, set, toJS } from "mobx";
import has from "lodash-es/has";
import { uId } from "./utils";

export default class Options {
  @observable options = {
    autoParseNumbers: false,
    defaultGenericError: null,
    fallback: true,
    retrieveOnlyDirtyValues: false,
    retrieveOnlyEnabledFields: false,
    showErrorsOnBlur: true,
    showErrorsOnChange: true,
    showErrorsOnClear: false,
    showErrorsOnInit: false,
    showErrorsOnReset: true,
    showErrorsOnSubmit: true,
    softDelete: false,
    strictDelete: true,
    strictUpdate: false,
    submitThrowsError: true,
    uniqueId: uId,
    validateDeletedFields: false,
    validateDisabledFields: false,
    validateOnBlur: true,
    validateOnChange: false,
    validateOnChangeAfterInitialBlur: false,
    validateOnChangeAfterSubmit: false,
    validateOnInit: true,
    validatePristineFields: true,
    validationDebounceWait: 250,
    validationDebounceOptions: {
      leading: false,
      trailing: true,
    },
  };

  get(key = null, field = null) {
    // handle field option
    if (has(field, "path")) {
      if (has(field.$options, key)) {
        return field.$options[key];
      }
    }

    // fallback on global form options
    if (key) return this.options[key];
    return toJS(this.options);
  }

  @action
  set(options) {
    if (set) {
      set(this.options, options);
    } else {
      extendObservable(this.options, options);
    }
  }
}
