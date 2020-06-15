"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _filter = require("lodash-es/filter");

var _filter2 = _interopRequireDefault(_filter);

var _first = require("lodash-es/first");

var _first2 = _interopRequireDefault(_first);

var _forIn = require("lodash-es/forIn");

var _forIn2 = _interopRequireDefault(_forIn);

var _isEmpty = require("lodash-es/isEmpty");

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _isFunction = require("lodash-es/isFunction");

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isString = require("lodash-es/isString");

var _isString2 = _interopRequireDefault(_isString);

var _split = require("lodash-es/split");

var _split2 = _interopRequireDefault(_split);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  Declarative Validation Rules

    const plugins = {
      dvr: dvr({
        package: validatorjs,
        extend: callback,
      }),
    };

*/
var DVR = function () {
  function DVR(_ref) {
    var _ref$config = _ref.config,
        config = _ref$config === undefined ? {} : _ref$config,
        _ref$state = _ref.state,
        state = _ref$state === undefined ? {} : _ref$state,
        _ref$promises = _ref.promises,
        promises = _ref$promises === undefined ? [] : _ref$promises;

    _classCallCheck(this, DVR);

    this.promises = [];
    this.config = null;
    this.state = null;
    this.extend = null;
    this.validator = null;

    this.state = state;
    this.promises = promises;
    this.extend = config.extend;
    this.validator = config.package || config;
    this.extendValidator();
  }

  _createClass(DVR, [{
    key: "extendValidator",
    value: function extendValidator() {
      // extend using "extend" callback
      if ((0, _isFunction2.default)(this.extend)) {
        this.extend({
          validator: this.validator,
          form: this.state.form
        });
      }
    }
  }, {
    key: "validateField",
    value: function validateField(field) {
      // get form fields data
      var data = this.state.form.validatedValues;
      this.validateFieldAsync(field, data);
      this.validateFieldSync(field, data);
    }
  }, {
    key: "makeLabels",
    value: function makeLabels(validation, field) {
      var _this = this;

      var labels = _defineProperty({}, field.path, field.label);
      (0, _forIn2.default)(validation.rules[field.path], function (rule) {
        if (typeof rule.value === "string" && rule.name.match(/^(required_|same|different)/)) {
          (0, _forIn2.default)(rule.value.split(","), function (p, i) {
            if (!rule.name.match(/^required_(if|unless)/) || i % 2 === 0) {
              var f = _this.state.form.$(p);
              if (f && f.path && f.label) {
                labels[f.path] = f.label;
              }
            }
          });
        }
      });
      validation.setAttributeNames(labels);
    }
  }, {
    key: "validateFieldSync",
    value: function validateFieldSync(field, data) {
      var $rules = this.rules(field.rules, "sync");
      // exit if no rules found
      if ((0, _isEmpty2.default)($rules[0])) return;
      // get field rules
      var rules = _defineProperty({}, field.path, $rules);
      // create the validator instance
      var validation = new this.validator(data, rules);
      // set label into errors messages instead key
      this.makeLabels(validation, field);
      // check validation
      if (validation.passes()) return;
      // the validation is failed, set the field error
      field.invalidate((0, _first2.default)(validation.errors.get(field.path)));
    }
  }, {
    key: "validateFieldAsync",
    value: function validateFieldAsync(field, data) {
      var _this2 = this;

      var $rules = this.rules(field.rules, "async");
      // exit if no rules found
      if ((0, _isEmpty2.default)($rules[0])) return;
      // get field rules
      var rules = _defineProperty({}, field.path, $rules);
      // create the validator instance
      var validation = new this.validator(data, rules);
      // set label into errors messages instead key
      this.makeLabels(validation, field);

      var $p = new Promise(function (resolve) {
        return validation.checkAsync(function () {
          return _this2.handleAsyncPasses(field, resolve);
        }, function () {
          return _this2.handleAsyncFails(field, validation, resolve);
        });
      });

      this.promises.push($p);
    }
  }, {
    key: "handleAsyncPasses",
    value: function handleAsyncPasses(field, resolve) {
      field.setValidationAsyncData(true);
      field.showAsyncErrors();
      resolve();
    }
  }, {
    key: "handleAsyncFails",
    value: function handleAsyncFails(field, validation, resolve) {
      field.setValidationAsyncData(false, (0, _first2.default)(validation.errors.get(field.path)));
      this.executeAsyncValidation(field);
      field.showAsyncErrors();
      resolve();
    }
  }, {
    key: "executeAsyncValidation",
    value: function executeAsyncValidation(field) {
      if (field.validationAsyncData.valid === false) {
        field.invalidate(field.validationAsyncData.message, true);
      }
    }
  }, {
    key: "rules",
    value: function rules(_rules, type) {
      var $rules = (0, _isString2.default)(_rules) ? (0, _split2.default)(_rules, "|") : _rules;
      // eslint-disable-next-line new-cap
      var v = new this.validator();
      return (0, _filter2.default)($rules, function ($rule) {
        return type === "async" ? v.getRule((0, _split2.default)($rule, ":")[0]).async : !v.getRule((0, _split2.default)($rule, ":")[0]).async;
      });
    }
  }]);

  return DVR;
}();

exports.default = function (config) {
  return {
    class: DVR,
    config: config
  };
};

module.exports = exports["default"];