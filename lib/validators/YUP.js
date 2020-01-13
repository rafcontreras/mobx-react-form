'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  YUP - Dead simple Object schema validation

    const plugins = {
      yup: $yup({
        package: yup,
        schema: (y) => (),
        extend,
      }),
    };

*/

var YUP = function () {
  function YUP(_ref) {
    var _ref$config = _ref.config,
        config = _ref$config === undefined ? {} : _ref$config,
        _ref$state = _ref.state,
        state = _ref$state === undefined ? {} : _ref$state,
        _ref$promises = _ref.promises,
        promises = _ref$promises === undefined ? [] : _ref$promises;

    _classCallCheck(this, YUP);

    this.promises = [];
    this.config = null;
    this.state = null;
    this.extend = null;
    this.validator = null;
    this.schema = null;

    this.state = state;
    this.promises = promises;
    this.extend = config.extend;
    this.validator = config.package || config;
    this.schema = config.schema(this.validator);
    this.extendValidator();
  }

  _createClass(YUP, [{
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
      var _this = this;

      var $p = new Promise(function (resolve) {
        return _this.validator.reach(_this.schema, field.path).label(field.label).validate(field.validatedValue, { strict: true }).then(function () {
          return _this.handleAsyncPasses(field, resolve);
        }).catch(function (error) {
          return _this.handleAsyncFails(field, resolve, error);
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
    value: function handleAsyncFails(field, resolve, error) {
      field.setValidationAsyncData(false, error.errors[0]);
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
  }]);

  return YUP;
}();

exports.default = function (config) {
  return {
    class: YUP,
    config: config
  };
};

module.exports = exports['default'];