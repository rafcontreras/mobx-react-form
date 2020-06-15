import { action } from "mobx";
import forIn from "lodash-es/forIn";
import get from "lodash-es/get";
import isNil from "lodash-es/isNil";
import trimStart from "lodash-es/trimStart";

import utils from "../utils";
import parser from "../parser";

/**
  Field Initializer
*/
export default {
  initFields(initial, update) {
    const fallback = this.state.options.get("fallback");
    const $path = (key) => trimStart([this.path, key].join("."), ".");

    let fields;
    fields = parser.prepareFieldsData(initial, this.state.strict, fallback);
    fields = parser.mergeSchemaDefaults(fields, this.validator);

    // create fields
    forIn(fields, (field, key) => {
      const path = $path(key);
      const $f = this.select(path, null, false);
      if (isNil($f)) {
        if (fallback) {
          this.initField(key, path, field, update);
        } else {
          const structPath = utils.pathToStruct(path);
          const struct = this.state.struct();
          const found = struct
            .filter((s) => s.startsWith(structPath))
            .find(
              (s) =>
                s.charAt(structPath.length) === "." ||
                s.substr(structPath.length, 2) === "[]" ||
                s === structPath
            );

          if (found) this.initField(key, path, field, update);
        }
      }
    });
  },

  @action
  initField(key, path, data, update = false) {
    const initial = this.state.get("current", "props");
    const struct = utils.pathToStruct(path);
    // try to get props from separated objects
    const $try = (prop) => get(initial[prop], struct);

    const props = {
      $bindings: $try("bindings"),
      $default: $try("defaults"),
      $disabled: $try("disabled"),
      $extra: $try("extra"),
      $handlers: $try("handlers"),
      $hooks: $try("hooks"),
      $initial: $try("initials"),
      $input: $try("input"),
      $interceptors: $try("interceptors"),
      $label: $try("labels"),
      $observers: $try("observers"),
      $options: $try("options"),
      $output: $try("output"),
      $placeholder: $try("placeholders"),
      $related: $try("related"),
      $rules: $try("rules"),
      $type: $try("types"),
      $validatedWith: $try("validatedWith"),
      $validators: $try("validators"),
      $value: get(initial["values"], path),
    };

    const field = this.state.form.makeField({
      data,
      key,
      path,
      props,
      state: this.state,
      update,
    });

    this.fields.merge({ [key]: field });

    return field;
  },
};
