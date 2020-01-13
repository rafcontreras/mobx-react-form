'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _split2 = require('lodash/split');

var _split3 = _interopRequireDefault(_split2);

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

var _first2 = require('lodash/first');

var _first3 = _interopRequireDefault(_first2);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _forIn2 = require('lodash/forIn');

var _forIn3 = _interopRequireDefault(_forIn2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
    key: 'extendValidator',
    value: function extendValidator() {
      // extend using "extend" callback
      if ((0, _isFunction3.default)(this.extend)) {
        this.extend({
          validator: this.validator,
          form: this.state.form
        });
      }
    }
  }, {
    key: 'validateField',
    value: function validateField(field) {
      // get form fields data
      var data = this.state.form.validatedValues;
      this.validateFieldAsync(field, data);
      this.validateFieldSync(field, data);
    }
  }, {
    key: 'makeLabels',
    value: function makeLabels(validation, field) {
      var _this = this;

      var labels = _defineProperty({}, field.path, field.label);
      (0, _forIn3.default)(validation.rules[field.path], function (rule) {
        if (typeof rule.value === 'string' && rule.name.match(/^(required_|same|different)/)) {
          (0, _forIn3.default)(rule.value.split(','), function (p, i) {
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
    key: 'validateFieldSync',
    value: function validateFieldSync(field, data) {
      var $rules = this.rules(field.rules, 'sync');
      // exit if no rules found
      if ((0, _isEmpty3.default)($rules[0])) return;
      // get field rules
      var rules = _defineProperty({}, field.path, $rules);
      // create the validator instance
      var validation = new this.validator(data, rules);
      // set label into errors messages instead key
      this.makeLabels(validation, field);
      // check validation
      if (validation.passes()) return;
      // the validation is failed, set the field error
      field.invalidate((0, _first3.default)(validation.errors.get(field.path)));
    }
  }, {
    key: 'validateFieldAsync',
    value: function validateFieldAsync(field, data) {
      var _this2 = this;

      var $rules = this.rules(field.rules, 'async');
      // exit if no rules found
      if ((0, _isEmpty3.default)($rules[0])) return;
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
    key: 'handleAsyncPasses',
    value: function handleAsyncPasses(field, resolve) {
      field.setValidationAsyncData(true);
      field.showAsyncErrors();
      resolve();
    }
  }, {
    key: 'handleAsyncFails',
    value: function handleAsyncFails(field, validation, resolve) {
      field.setValidationAsyncData(false, (0, _first3.default)(validation.errors.get(field.path)));
      this.executeAsyncValidation(field);
      field.showAsyncErrors();
      resolve();
    }
  }, {
    key: 'executeAsyncValidation',
    value: function executeAsyncValidation(field) {
      if (field.validationAsyncData.valid === false) {
        field.invalidate(field.validationAsyncData.message, true);
      }
    }
  }, {
    key: 'rules',
    value: function rules(_rules, type) {
      var $rules = (0, _isString3.default)(_rules) ? (0, _split3.default)(_rules, '|') : _rules;
      // eslint-disable-next-line new-cap
      var v = new this.validator();
      return (0, _filter3.default)($rules, function ($rule) {
        return type === 'async' ? v.getRule((0, _split3.default)($rule, ':')[0]).async : !v.getRule((0, _split3.default)($rule, ':')[0]).async;
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

module.exports = exports['default'];