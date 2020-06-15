"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _desc, _value, _obj;

var _mobx = require("mobx");

var _forIn = require("lodash-es/forIn");

var _forIn2 = _interopRequireDefault(_forIn);

var _get = require("lodash-es/get");

var _get2 = _interopRequireDefault(_get);

var _isNil = require("lodash-es/isNil");

var _isNil2 = _interopRequireDefault(_isNil);

var _trimStart = require("lodash-es/trimStart");

var _trimStart2 = _interopRequireDefault(_trimStart);

var _utils = require("../utils");

var _utils2 = _interopRequireDefault(_utils);

var _parser = require("../parser");

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

/**
  Field Initializer
*/
exports.default = (_obj = {
  initFields: function initFields(initial, update) {
    var _this = this;

    var fallback = this.state.options.get("fallback");
    var $path = function $path(key) {
      return (0, _trimStart2.default)([_this.path, key].join("."), ".");
    };

    var fields = void 0;
    fields = _parser2.default.prepareFieldsData(initial, this.state.strict, fallback);
    fields = _parser2.default.mergeSchemaDefaults(fields, this.validator);

    // create fields
    (0, _forIn2.default)(fields, function (field, key) {
      var path = $path(key);
      var $f = _this.select(path, null, false);
      if ((0, _isNil2.default)($f)) {
        if (fallback) {
          _this.initField(key, path, field, update);
        } else {
          var structPath = _utils2.default.pathToStruct(path);
          var struct = _this.state.struct();
          var found = struct.filter(function (s) {
            return s.startsWith(structPath);
          }).find(function (s) {
            return s.charAt(structPath.length) === "." || s.substr(structPath.length, 2) === "[]" || s === structPath;
          });

          if (found) _this.initField(key, path, field, update);
        }
      }
    });
  },
  initField: function initField(key, path, data) {
    var update = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var initial = this.state.get("current", "props");
    var struct = _utils2.default.pathToStruct(path);
    // try to get props from separated objects
    var $try = function $try(prop) {
      return (0, _get2.default)(initial[prop], struct);
    };

    var props = {
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
      $value: (0, _get2.default)(initial["values"], path)
    };

    var field = this.state.form.makeField({
      data: data,
      key: key,
      path: path,
      props: props,
      state: this.state,
      update: update
    });

    this.fields.merge(_defineProperty({}, key, field));

    return field;
  }
}, (_applyDecoratedDescriptor(_obj, "initField", [_mobx.action], Object.getOwnPropertyDescriptor(_obj, "initField"), _obj)), _obj);
module.exports = exports["default"];