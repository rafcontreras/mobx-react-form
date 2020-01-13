'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mobx = require('mobx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isPromise = function isPromise(obj) {
  return !!obj && typeof obj.then === 'function' && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function');
};

/**
  Vanilla JavaScript Functions

    const plugins = {
      vkf: vkf({
        package: validator,
      }),
    };

*/

var VJF = function () {
  function VJF(_ref) {
    var _ref$config = _ref.config,
        config = _ref$config === undefined ? {} : _ref$config,
        _ref$state = _ref.state,
        state = _ref$state === undefined ? {} : _ref$state,
        _ref$promises = _ref.promises,
        promises = _ref$promises === undefined ? [] : _ref$promises;

    _classCallCheck(this, VJF);

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

  _createClass(VJF, [{
    key: 'extendValidator',
    value: function extendValidator() {
      // extend using "extend" callback
      if (_lodash2.default.isFunction(this.extend)) {
        this.extend({
          validator: this.validator,
          form: this.state.form
        });
      }
    }
  }, {
    key: 'validateField',
    value: function validateField(field) {
      var _this = this;

      // exit if field does not have validation functions
      if (!field.validators) return;
      // get validators from validate property
      var $fn = (0, _mobx.toJS)(field.validators);
      // map only if is an array of validator functions
      if (_lodash2.default.isArray($fn)) {
        $fn.map(function (fn) {
          return _this.collectData(fn, field);
        });
      }
      // it's just one function
      if (_lodash2.default.isFunction($fn)) {
        this.collectData($fn, field);
      }
      // execute the validation function
      this.executeValidation(field);
    }
  }, {
    key: 'collectData',
    value: function collectData($fn, field) {
      var _this2 = this;

      var res = this.handleFunctionResult($fn, field);
      // check and execute only if is a promise
      if (isPromise(res)) {
        var $p = res.then(function ($res) {
          return field.setValidationAsyncData($res[0], $res[1]);
        }).then(function () {
          return _this2.executeAsyncValidation(field);
        }).then(function () {
          return field.showAsyncErrors();
        });
        // push the promise into array
        this.promises.push($p);
        return;
      }
      // is a plain function
      field.validationFunctionsData.unshift({
        valid: res[0],
        message: res[1]
      });
    }
  }, {
    key: 'executeValidation',
    value: function executeValidation(field) {
      // otherwise find an error message to show
      field.validationFunctionsData.map(function (rule) {
        return rule.valid === false && field.invalidate(rule.message);
      });
    }
  }, {
    key: 'executeAsyncValidation',
    value: function executeAsyncValidation(field) {
      if (field.validationAsyncData.valid === false) {
        field.invalidate(field.validationAsyncData.message, true);
      }
    }
  }, {
    key: 'handleFunctionResult',
    value: function handleFunctionResult($fn, field) {
      // executre validation function
      var res = $fn({
        validator: this.validator,
        form: this.state.form,
        field: field
      });

      /**
        Handle "array"
      */
      if (_lodash2.default.isArray(res)) {
        var isValid = res[0] || false;
        var message = res[1] || 'Error';
        return [isValid, message];
      }

      /**
        Handle "boolean"
      */
      if (_lodash2.default.isBoolean(res)) {
        return [res, 'Error'];
      }

      /**
        Handle "string"
      */
      if (_lodash2.default.isString(res)) {
        return [false, res];
      }

      /**
        Handle "object / promise"
      */
      if (isPromise(res)) {
        return res; // the promise
      }

      /**
        Handle other cases
      */
      return [false, 'Error'];
    }
  }]);

  return VJF;
}();

exports.default = function (config) {
  return {
    class: VJF,
    config: config
  };
};

module.exports = exports['default'];