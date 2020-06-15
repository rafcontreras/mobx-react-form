"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _each = require("lodash-es/each");

var _each2 = _interopRequireDefault(_each);

var _has = require("lodash-es/has");

var _has2 = _interopRequireDefault(_has);

var _isFunction = require("lodash-es/isFunction");

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isPlainObject = require("lodash-es/isPlainObject");

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _merge4 = require("lodash-es/merge");

var _merge5 = _interopRequireDefault(_merge4);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bindings = function () {
  function Bindings() {
    _classCallCheck(this, Bindings);

    this.templates = {
      // default: ({ field, props, keys, $try }) => ({
      //   [keys.id]: $try(props.id, field.id),
      // }),
    };
    this.rewriters = {
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
        value: "value"
      }
    };
  }

  _createClass(Bindings, [{
    key: "load",
    value: function load(field) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "default";
      var props = arguments[2];

      if ((0, _has2.default)(this.rewriters, name)) {
        var $bindings = {};

        (0, _each2.default)(this.rewriters[name], function ($v, $k) {
          return (0, _merge5.default)($bindings, _defineProperty({}, $v, (0, _utils.$try)(props[$k], field[$k])));
        });

        return $bindings;
      }

      return this.templates[name]({
        keys: this.rewriters[name],
        $try: _utils.$try,
        field: field,
        props: props
      });
    }
  }, {
    key: "register",
    value: function register(bindings) {
      var _this = this;

      (0, _each2.default)(bindings, function (val, key) {
        if ((0, _isFunction2.default)(val)) (0, _merge5.default)(_this.templates, _defineProperty({}, key, val));
        if ((0, _isPlainObject2.default)(val)) (0, _merge5.default)(_this.rewriters, _defineProperty({}, key, val));
      });

      return this;
    }
  }]);

  return Bindings;
}();

exports.default = Bindings;
module.exports = exports["default"];