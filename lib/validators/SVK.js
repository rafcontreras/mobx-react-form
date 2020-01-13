'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isPromise = function isPromise(obj) {
  return !!obj && typeof obj.then === 'function' && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function');
};

/**
  Schema Validation Keywords

    const plugins = {
      svk: svk({
        package: ajv,
        extend: callback,
      }),
    };

*/

var SVK = function () {
  function SVK(_ref) {
    var _ref$config = _ref.config,
        config = _ref$config === undefined ? {} : _ref$config,
        _ref$state = _ref.state,
        state = _ref$state === undefined ? {} : _ref$state,
        _ref$promises = _ref.promises,
        promises = _ref$promises === undefined ? [] : _ref$promises;

    _classCallCheck(this, SVK);

    this.promises = [];
    this.config = null;
    this.state = null;
    this.extend = null;
    this.validator = null;
    this.schema = null;

    this.state = state;
    this.promises = promises;
    this.extend = config.extend;
    this.schema = config.schema;
    this.initAJV(config);
  }

  _createClass(SVK, [{
    key: 'extendOptions',
    value: function extendOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return Object.assign(options, {
        allowRequired: _lodash2.default.get(options, 'allowRequired') || false,
        errorDataPath: 'property',
        allErrors: true,
        coerceTypes: true,
        v5: true
      });
    }
  }, {
    key: 'initAJV',
    value: function initAJV(config, form) {
      // get ajv package
      var ajv = config.package || config;
      // create ajv instance
      var validator = new ajv(this.extendOptions(config.options));
      // extend ajv using "extend" callback
      if (_lodash2.default.isFunction(this.extend)) {
        this.extend({
          form: this.state.form,
          validator: validator
        });
      }
      // create ajv validator (compiling rules)
      this.validator = validator.compile(this.schema);
    }
  }, {
    key: 'validateField',
    value: function validateField(field) {
      var _this = this;

      var data = _defineProperty({}, field.path, field.validatedValue);
      var validate = this.validator(this.parseValues(data));
      // check if is $async schema
      if (isPromise(validate)) {
        var $p = validate.then(function () {
          return field.setValidationAsyncData(true);
        }).catch(function (err) {
          return err && _this.handleAsyncError(field, err.errors);
        }).then(function () {
          return _this.executeAsyncValidation(field);
        }).then(function () {
          return field.showAsyncErrors();
        });

        // push the promise into array
        this.promises.push($p);
        return;
      }
      // check sync errors
      this.handleSyncError(field, this.validator.errors);
    }
  }, {
    key: 'handleSyncError',
    value: function handleSyncError(field, errors) {
      var fieldErrorObj = this.findError(field.key, errors);
      // if fieldErrorObj is not undefined, the current field is invalid.
      if (_lodash2.default.isUndefined(fieldErrorObj)) return;
      // the current field is now invalid
      // add additional info to the message
      var msg = field.label + ' ' + fieldErrorObj.message;
      // invalidate the current field with message
      field.invalidate(msg);
    }
  }, {
    key: 'handleAsyncError',
    value: function handleAsyncError(field, errors) {
      // find current field error message from ajv errors
      var fieldErrorObj = this.findError(field.path, errors);
      // if fieldErrorObj is not undefined, the current field is invalid.
      if (_lodash2.default.isUndefined(fieldErrorObj)) return;
      // the current field is now invalid
      // add additional info to the message
      var msg = field.label + ' ' + fieldErrorObj.message;
      // set async validation data on the field
      field.setValidationAsyncData(false, msg);
    }
  }, {
    key: 'findError',
    value: function findError(path, errors) {
      return _lodash2.default.find(errors, function (_ref2) {
        var dataPath = _ref2.dataPath;

        var $dataPath = void 0;
        $dataPath = _lodash2.default.trimStart(dataPath, '.');
        $dataPath = _lodash2.default.trim($dataPath, '[\'');
        $dataPath = _lodash2.default.trim($dataPath, '\']');
        return _lodash2.default.includes($dataPath, '' + path);
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
    key: 'parseValues',
    value: function parseValues(values) {
      if (_lodash2.default.get(this.config, 'options.allowRequired') === true) {
        return _lodash2.default.omitBy(values, _lodash2.default.isEmpty || _lodash2.default.isNull || _lodash2.default.isUndefined || _lodash2.default.isNaN);
      }
      return values;
    }
  }]);

  return SVK;
}();

exports.default = function (config) {
  return {
    class: SVK,
    config: config
  };
};

module.exports = exports['default'];