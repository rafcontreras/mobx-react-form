import each from "lodash-es/each";
import has from "lodash-es/has";
import isFunction from "lodash-es/isFunction";
import isPlainObject from "lodash-es/isPlainObject";
import merge from "lodash-es/merge";

import { $try } from "./utils";

export default class Bindings {
  templates = {
    // default: ({ field, props, keys, $try }) => ({
    //   [keys.id]: $try(props.id, field.id),
    // }),
  };

  rewriters = {
    default: {
      autoFocus: "autoFocus",
      checked: "checked",
      disabled: "disabled",
      id: "id",
      label: "label",
      name: "name",
      onBlur: "onBlur",
      onChange: "onChange",
      onFocus: "onFocus",
      placeholder: "placeholder",
      type: "type",
      value: "value",
    },
  };

  load(field, name = "default", props) {
    if (has(this.rewriters, name)) {
      const $bindings = {};

      each(this.rewriters[name], ($v, $k) =>
        merge($bindings, { [$v]: $try(props[$k], field[$k]) })
      );

      return $bindings;
    }

    return this.templates[name]({
      keys: this.rewriters[name],
      $try,
      field,
      props,
    });
  }

  register(bindings) {
    each(bindings, (val, key) => {
      if (isFunction(val)) merge(this.templates, { [key]: val });
      if (isPlainObject(val)) merge(this.rewriters, { [key]: val });
    });

    return this;
  }
}
