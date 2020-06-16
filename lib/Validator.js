"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class, _descriptor;

var _mobx = require("mobx");

var _each = require("lodash-es/each");

var _each2 = _interopRequireDefault(_each);

var _get = require("lodash-es/get");

var _get2 = _interopRequireDefault(_get);

var _has = require("lodash-es/has");

var _has2 = _interopRequireDefault(_has);

var _isNil = require("lodash-es/isNil");

var _isNil2 = _interopRequireDefault(_isNil);

var _isString = require("lodash-es/isString");

var _isString2 = _interopRequireDefault(_isString);

var _map = require("lodash-es/map");

var _map2 = _interopRequireDefault(_map);

var _merge = require("lodash-es/merge");

var _merge2 = _interopRequireDefault(_merge);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var Validator = (_class = function () {
  function Validator() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Validator);

    this.promises = [];
    this.form = {};
    this.options = {};
    this.drivers = {};
    this.plugins = {
      vjf: undefined,
      dvr: undefined,
      svk: undefined,
      yup: undefined
    };

    _initDefineProp(this, "error", _descriptor, this);

    (0, _merge2.default)(this.plugins, obj.plugins);
    this.form = obj.form;

    this.initDrivers();
    this.checkSVKValidationPlugin();
  }

  _createClass(Validator, [{
    key: "initDrivers",
    value: function initDrivers() {
      var _this = this;

      (0, _map2.default)(this.plugins, function (driver, key) {
        return _this.drivers[key] = driver && (0, _has2.default)(driver, "class") && new driver.class({
          config: driver.config,
          state: _this.form.state,
          promises: _this.promises
        });
      });
    }
  }, {
    key: "validate",
    value: function validate() {
      var _this2 = this;

      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var path = (0, _utils.$try)(opt.path, opt);
      var field = (0, _utils.$try)(opt.field, this.form.select(path, null, null));
      var related = (0, _utils.$try)(opt.related, obj.related, true);
      var showErrors = (0, _utils.$try)(opt.showErrors, obj.showErrors, false);
      var instance = field || this.form;
      instance.$validating = true;
      instance.$validated += 1;

      this.error = null;

      return new Promise(function (resolve) {
        // validate instance (form or filed)
        if (instance.path || (0, _isString2.default)(path)) {
          _this2.validateField({
            field: instance,
            showErrors: showErrors,
            related: related,
            path: path
          });
        }

        // validate nested fields
        instance.each(function ($field) {
          return _this2.validateField({
            path: $field.path,
            field: $field,
            showErrors: showErrors,
            related: related
          });
        });

        // wait all promises
        resolve(Promise.all(_this2.promises));
      }).then((0, _mobx.action)(function () {
        instance.$validating = false;
        instance.$clearing = false;
        instance.$resetting = false;
      })).catch((0, _mobx.action)(function (err) {
        instance.$validating = false;
        instance.$clearing = false;
        instance.$resetting = false;
        throw err;
      })).then(function () {
        return instance;
      });
    }
  }, {
    key: "validateField",
    value: function validateField(_ref) {
      var _ref$showErrors = _ref.showErrors,
          showErrors = _ref$showErrors === undefined ? false : _ref$showErrors,
          _ref$related = _ref.related,
          related = _ref$related === undefined ? false : _ref$related,
          _ref$field = _ref.field,
          field = _ref$field === undefined ? null : _ref$field,
          path = _ref.path;

      var instance = field || this.form.select(path);
      // check if the field is a valid instance
      if (!instance.path) throw new Error("Validation Error: Invalid Field Instance");
      // do not validate soft deleted fields
      if (instance.deleted && !this.form.state.options.get("validateDeletedFields")) return;
      // do not validate disabled fields
      if (instance.disabled && !this.form.state.options.get("validateDisabledFields")) return;
      // do not validate pristine fields
      if (instance.isPristine && !this.form.state.options.get("validatePristineFields")) return;
      // reset field validation
      instance.resetValidation();
      // validate with all enabled drivers
      (0, _each2.default)(this.drivers, function (driver) {
        return driver && driver.validateField(instance);
      });
      // send error to the view
      instance.showErrors(showErrors);
      // related validation
      if (related) this.relatedFieldValidation(instance, showErrors);
    }

    /**
      Validate 'related' fields if specified
      and related validation allowed (recursive)
    */

  }, {
    key: "relatedFieldValidation",
    value: function relatedFieldValidation(field, showErrors) {
      var _this3 = this;

      if (!field.related || !field.related.length) return;

      (0, _each2.default)(field.related, function (path) {
        return _this3.validateField({
          related: false,
          showErrors: showErrors,
          path: path
        });
      });
    }
  }, {
    key: "checkSVKValidationPlugin",
    value: function checkSVKValidationPlugin() {
      if ((0, _isNil2.default)(this.drivers.svk) && (0, _get2.default)(this.plugins, "svk.config.schema")) {
        var form = this.state.form.name ? "Form: " + this.state.form.name : "";
        throw new Error("The SVK validation schema is defined but no plugin provided (SVK). " + form);
      }
    }
  }]);

  return Validator;
}(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "error", [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _applyDecoratedDescriptor(_class.prototype, "validate", [_mobx.action], Object.getOwnPropertyDescriptor(_class.prototype, "validate"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "validateField", [_mobx.action], Object.getOwnPropertyDescriptor(_class.prototype, "validateField"), _class.prototype)), _class);
exports.default = Validator;
module.exports = exports["default"];