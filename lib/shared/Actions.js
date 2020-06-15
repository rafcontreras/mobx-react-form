"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _desc, _value, _obj;

var _mobx = require("mobx");

var _each = require("lodash-es/each");

var _each2 = _interopRequireDefault(_each);

var _has = require("lodash-es/has");

var _has2 = _interopRequireDefault(_has);

var _isArray = require("lodash-es/isArray");

var _isArray2 = _interopRequireDefault(_isArray);

var _isDate = require("lodash-es/isDate");

var _isDate2 = _interopRequireDefault(_isDate);

var _isEmpty = require("lodash-es/isEmpty");

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _isInteger = require("lodash-es/isInteger");

var _isInteger2 = _interopRequireDefault(_isInteger);

var _isNil = require("lodash-es/isNil");

var _isNil2 = _interopRequireDefault(_isNil);

var _isNull = require("lodash-es/isNull");

var _isNull2 = _interopRequireDefault(_isNull);

var _isObject = require("lodash-es/isObject");

var _isObject2 = _interopRequireDefault(_isObject);

var _isPlainObject = require("lodash-es/isPlainObject");

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _isString = require("lodash-es/isString");

var _isString2 = _interopRequireDefault(_isString);

var _isUndefined = require("lodash-es/isUndefined");

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _last = require("lodash-es/last");

var _last2 = _interopRequireDefault(_last);

var _map = require("lodash-es/map");

var _map2 = _interopRequireDefault(_map);

var _max = require("lodash-es/max");

var _max2 = _interopRequireDefault(_max);

var _merge = require("lodash-es/merge");

var _merge2 = _interopRequireDefault(_merge);

var _set2 = require("lodash-es/set");

var _set3 = _interopRequireDefault(_set2);

var _split = require("lodash-es/split");

var _split2 = _interopRequireDefault(_split);

var _transform = require("lodash-es/transform");

var _transform2 = _interopRequireDefault(_transform);

var _trim = require("lodash-es/trim");

var _trim2 = _interopRequireDefault(_trim);

var _trimStart = require("lodash-es/trimStart");

var _trimStart2 = _interopRequireDefault(_trimStart);

var _utils = require("../utils");

var _utils2 = _interopRequireDefault(_utils);

var _parser = require("../parser");

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
  Field Actions
*/
exports.default = (_obj = {
  validate: function validate() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var $opt = (0, _merge2.default)(opt, { path: this.path });
    return this.state.form.validator.validate($opt, obj);
  },
  submit: function submit() {
    var _this = this;

    var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.$submitting = true;
    this.$submitted += 1;

    var exec = function exec(isValid) {
      return isValid ? _this.execHook("onSuccess", o) : _this.execHook("onError", o);
    };

    var validate = function validate() {
      return _this.validate({
        showErrors: _this.state.options.get("showErrorsOnSubmit", _this)
      }).then(function (_ref) {
        var isValid = _ref.isValid;

        var handler = exec(isValid);
        if (isValid) return handler;
        var $err = _this.state.options.get("defaultGenericError", _this);
        var $throw = _this.state.options.get("submitThrowsError", _this);
        if ($throw && $err) _this.invalidate();
        return handler;
      })
      // eslint-disable-next-line
      .then((0, _mobx.action)(function () {
        return _this.$submitting = false;
      })).catch((0, _mobx.action)(function (err) {
        _this.$submitting = false;
        throw err;
      })).then(function () {
        return _this;
      });
    };

    return _utils2.default.isPromise(exec) ? exec.then(function () {
      return validate();
    }) : validate();
  },


  /**
   Check Field Computed Values
   */
  check: function check(prop) {
    var deep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _utils2.default.allowedProps("booleans", [prop]);

    return deep ? _utils2.default.checkPropType({
      type: _utils2.default.props.types[prop],
      data: this.deepCheck(_utils2.default.props.types[prop], prop, this.fields)
    }) : this[prop];
  },
  deepCheck: function deepCheck(type, prop, fields) {
    var _this2 = this;

    var $fields = _utils2.default.getObservableMapValues(fields);
    return (0, _transform2.default)($fields, function (check, field) {
      if (!field.fields.size || _utils2.default.props.exceptions.includes(prop)) {
        check.push(field[prop]);
      }

      var $deep = _this2.deepCheck(type, prop, field.fields);
      check.push(_utils2.default.checkPropType({ type: type, data: $deep }));
      return check;
    }, []);
  },


  /**
   Update Field Values recurisvely
   OR Create Field if 'undefined'
   */
  update: function update(fields) {
    if (!(0, _isPlainObject2.default)(fields)) {
      throw new Error("The update() method accepts only plain objects.");
    }

    return this.deepUpdate(_parser2.default.prepareFieldsData({ fields: fields }));
  },
  deepUpdate: function deepUpdate(fields) {
    var _this3 = this;

    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var recursion = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    (0, _each2.default)(fields, function (field, key) {
      var $key = (0, _has2.default)(field, "name") ? field.name : key;
      var $path = (0, _trimStart2.default)(path + "." + $key, ".");
      var $field = _this3.select($path, null, false);
      var $container = _this3.select(path, null, false) || _this3.state.form.select(_this3.path, null, false);

      if (!(0, _isNil2.default)($field) && !(0, _isUndefined2.default)(field)) {
        if ((0, _isArray2.default)($field.values())) {
          var n = (0, _max2.default)((0, _map2.default)(field.fields, function (f, i) {
            return Number(i);
          }));
          if (n === undefined) n = -1; // field's value is []
          (0, _each2.default)(_utils2.default.getObservableMapValues($field.fields), function ($f) {
            if (Number($f.name) > n) $field.fields.delete($f.name);
          });
        }
        if ((0, _isNull2.default)(field) || (0, _isNil2.default)(field.fields)) {
          $field.$value = _parser2.default.parseInput($field.$input, {
            separated: field
          });
          return;
        }
      }

      if (!(0, _isNil2.default)($container) && (0, _isNil2.default)($field)) {
        // get full path when using update() with select() - FIX: #179
        var $newFieldPath = (0, _trimStart2.default)([_this3.path, $path].join("."), ".");
        // init field into the container field
        $container.initField($key, $newFieldPath, field, true);
      } else if (recursion) {
        if ((0, _has2.default)(field, "fields") && !(0, _isNil2.default)(field.fields)) {
          // handle nested fields if defined
          _this3.deepUpdate(field.fields, $path);
        } else {
          // handle nested fields if undefined or null
          var $fields = _parser2.default.pathToFieldsTree(_this3.state.struct(), $path);
          _this3.deepUpdate($fields, $path, false);
        }
      }
    });
  },


  /**
    Get Fields Props
   */
  get: function get() {
    var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if ((0, _isNil2.default)(prop)) {
      return this.deepGet([].concat(_toConsumableArray(_utils2.default.props.booleans), _toConsumableArray(_utils2.default.props.field), _toConsumableArray(_utils2.default.props.validation)), this.fields);
    }

    _utils2.default.allowedProps("all", (0, _isArray2.default)(prop) ? prop : [prop]);

    if ((0, _isString2.default)(prop)) {
      if (strict && this.fields.size === 0) {
        return _parser2.default.parseCheckOutput(this, prop);
      }

      var value = this.deepGet(prop, this.fields);
      return _parser2.default.parseCheckArray(this, value, prop);
    }

    return this.deepGet(prop, this.fields);
  },


  /**
    Get Fields Props Recursively
   */
  deepGet: function deepGet(prop, fields) {
    var _this4 = this;

    return (0, _transform2.default)(_utils2.default.getObservableMapValues(fields), function (obj, field) {
      var $nested = function $nested($fields) {
        return $fields.size !== 0 ? _this4.deepGet(prop, $fields) : undefined;
      };

      Object.assign(obj, _defineProperty({}, field.key, { fields: $nested(field.fields) }));

      if ((0, _isString2.default)(prop)) {
        var removeValue = prop === "value" && (_this4.state.options.get("retrieveOnlyDirtyValues", _this4) && field.isPristine || _this4.state.options.get("retrieveOnlyEnabledFields", _this4) && field.disabled || _this4.state.options.get("softDelete", _this4) && field.deleted);

        if (field.fields.size === 0) {
          delete obj[field.key]; // eslint-disable-line
          if (removeValue) return obj;
          return Object.assign(obj, _defineProperty({}, field.key, _parser2.default.parseCheckOutput(field, prop)));
        }

        var value = _this4.deepGet(prop, field.fields);
        if (prop === "value") value = field.$output(value);

        delete obj[field.key]; // eslint-disable-line
        if (removeValue) return obj;

        return Object.assign(obj, _defineProperty({}, field.key, _parser2.default.parseCheckArray(field, value, prop)));
      }

      (0, _each2.default)(prop, function ($prop) {
        return Object.assign(obj[field.key], _defineProperty({}, $prop, field[$prop]));
      });

      return obj;
    }, {});
  },
  set: function set(prop, data) {
    // UPDATE CUSTOM PROP
    if ((0, _isString2.default)(prop) && !(0, _isUndefined2.default)(data)) {
      _utils2.default.allowedProps("field", [prop]);
      var deep = (0, _isObject2.default)(data) && prop === "value" || (0, _isPlainObject2.default)(data);
      if (deep && this.hasNestedFields) this.deepSet(prop, data, "", true);else (0, _set3.default)(this, "$" + prop, data);
      return;
    }

    // NO PROP NAME PROVIDED ("prop" is value)
    if ((0, _isNil2.default)(data)) {
      if (this.hasNestedFields) this.deepSet("value", prop, "", true);else this.set("value", prop);
    }
  },


  /**
    Set Fields Props Recursively
   */
  deepSet: function deepSet($, data) {
    var _this5 = this;

    var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var recursion = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var err = "You are updating a not existent field:";
    var isStrict = this.state.options.get("strictUpdate", this);

    if ((0, _isNil2.default)(data)) {
      this.each(function (field) {
        return field.clear(true);
      });
      return;
    }

    (0, _each2.default)(data, function ($val, $key) {
      var $path = (0, _trimStart2.default)(path + "." + $key, ".");
      // get the field by path joining keys recursively
      var field = _this5.select($path, null, isStrict);
      // if no field found when is strict update, throw error
      if (isStrict) _utils2.default.throwError($path, field, err);
      // update the field/fields if defined
      if (!(0, _isUndefined2.default)(field)) {
        // update field values or others props
        if (!(0, _isUndefined2.default)($val)) {
          field.set($, $val, recursion);
        }
        // update values recursively only if field has nested
        if (field.fields.size && (0, _isObject2.default)($val)) {
          _this5.deepSet($, $val, $path, recursion);
        }
      }
    });
  },
  add: function add(obj) {
    var _this6 = this;

    if (_utils2.default.isArrayOfObjects(obj)) {
      return (0, _each2.default)(obj, function (values) {
        return _this6.update(_defineProperty({}, _utils2.default.maxKey(_this6.fields), values));
      });
    }

    var key = void 0; // eslint-disable-next-line
    if ((0, _has2.default)(obj, "key")) key = obj.key;
    if ((0, _has2.default)(obj, "name")) key = obj.name;
    if (!key) key = _utils2.default.maxKey(this.fields);

    var $path = function $path($key) {
      return (0, _trimStart2.default)([_this6.path, $key].join("."), ".");
    };
    var tree = _parser2.default.pathToFieldsTree(this.state.struct(), this.path, 0, true);
    return this.initField(key, $path(key), (0, _merge2.default)(tree[0], obj));
  },
  del: function del() {
    var $path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var isStrict = this.state.options.get("strictDelete", this);
    var path = _parser2.default.parsePath(_utils2.default.$try($path, this.path));
    var fullpath = (0, _trim2.default)([this.path, path].join("."), ".");
    var container = this.container($path);
    var keys = (0, _split2.default)(path, ".");
    var last = last(keys);

    if (isStrict && !container.fields.has(last)) {
      var msg = "Key \"" + last + "\" not found when trying to delete field";
      _utils2.default.throwError(fullpath, null, msg);
    }

    if (this.state.options.get("softDelete", this)) {
      return this.select(fullpath).set("deleted", true);
    }

    return container.fields.delete(last);
  }
}, (_applyDecoratedDescriptor(_obj, "submit", [_mobx.action], Object.getOwnPropertyDescriptor(_obj, "submit"), _obj), _applyDecoratedDescriptor(_obj, "deepUpdate", [_mobx.action], Object.getOwnPropertyDescriptor(_obj, "deepUpdate"), _obj), _applyDecoratedDescriptor(_obj, "set", [_mobx.action], Object.getOwnPropertyDescriptor(_obj, "set"), _obj), _applyDecoratedDescriptor(_obj, "add", [_mobx.action], Object.getOwnPropertyDescriptor(_obj, "add"), _obj), _applyDecoratedDescriptor(_obj, "del", [_mobx.action], Object.getOwnPropertyDescriptor(_obj, "del"), _obj)), _obj);
module.exports = exports["default"];