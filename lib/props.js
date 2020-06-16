"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  booleans: ["blurred", "changed", "clearing", "deleted", "disabled", "focused", "hasError", "isDefault", "isDirty", "isEmpty", "isPristine", "isValid", "resetting", "touched"],
  field: ["bindings", "default", "deleted", "disabled", "error", "extra", "handlers", "hooks", "initial", "label", "options", "placeholder", "related", "type", "value"],
  separated: ["bindings", "defaults", "deleted", "disabled", "error", "extra", "handlers", "hooks", "initials", "labels", "options", "placeholders", "related", "types", "values"],
  handlers: ["onAdd", "onBlur", "onChange", "onClear", "onDel", "onDrop", "onFocus", "onReset", "onSubmit", "onToggle"],
  function: ["input", "interceptors", "observers", "output"],
  validation: ["rules", "validateWith", "validators"],
  exceptions: ["isDirty", "isPristine"],
  types: {
    blurred: "some",
    changed: "some",
    clearing: "every",
    deleted: "every",
    disabled: "every",
    focused: "some",
    hasError: "some",
    isDefault: "every",
    isDirty: "some",
    isEmpty: "every",
    isPristine: "every",
    isValid: "every",
    resetting: "every",
    touched: "some"
  }
};
module.exports = exports["default"];