'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _desc, _value, _obj;

var _mobx = require('mobx');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _parser = require('../parser');

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

    var $opt = _lodash2.default.merge(opt, { path: this.path });
    return this.state.form.validator.validate($opt, obj);
  },
  submit: function submit() {
    var _this = this;

    var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.$submitting = true;
    this.$submitted += 1;

    var exec = function exec(isValid) {
      return isValid ? _this.execHook('onSuccess', o) : _this.execHook('onError', o);
    };

    var validate = function validate() {
      return _this.validate({
        showErrors: _this.state.options.get('showErrorsOnSubmit', _this)
      }).then(function (_ref) {
        var isValid = _ref.isValid;

        var handler = exec(isValid);
        if (isValid) return handler;
        var $err = _this.state.options.get('defaultGenericError', _this);
        var $throw = _this.state.options.get('submitThrowsError', _this);
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

    _utils2.default.allowedProps('booleans', [prop]);

    return deep ? _utils2.default.checkPropType({
      type: _utils2.default.props.types[prop],
      data: this.deepCheck(_utils2.default.props.types[prop], prop, this.fields)
    }) : this[prop];
  },
  deepCheck: function deepCheck(type, prop, fields) {
    var _this2 = this;

    var $fields = _utils2.default.getObservableMapValues(fields);
    return _lodash2.default.transform($fields, function (check, field) {
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
    if (!_lodash2.default.isPlainObject(fields)) {
      throw new Error('The update() method accepts only plain objects.');
    }

    return this.deepUpdate(_parser2.default.prepareFieldsData({ fields: fields }));
  },
  deepUpdate: function deepUpdate(fields) {
    var _this3 = this;

    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var recursion = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _lodash2.default.each(fields, function (field, key) {
      var $key = _lodash2.default.has(field, 'name') ? field.name : key;
      var $path = _lodash2.default.trimStart(path + '.' + $key, '.');
      var $field = _this3.select($path, null, false);
      var $container = _this3.select(path, null, false) || _this3.state.form.select(_this3.path, null, false);

      if (!_lodash2.default.isNil($field) && !_lodash2.default.isNil(field)) {
        if (_lodash2.default.isArray($field.values())) {
          _lodash2.default.each(_utils2.default.getObservableMapValues($field.fields), function ($f) {
            return $field.fields.delete($f.name);
          });
        }
        if (_lodash2.default.isNil(field.fields)) {
          $field.value = field;
          return;
        }
      }

      if (!_lodash2.default.isNil($container)) {
        // get full path when using update() with select() - FIX: #179
        var $newFieldPath = _lodash2.default.trimStart([_this3.path, $path].join('.'), '.');
        // init field into the container field
        $container.initField($key, $newFieldPath, field, true);
      }

      if (recursion) {
        // handle nested fields if undefined or null
        var $fields = _parser2.default.pathToFieldsTree(_this3.state.struct(), $path);
        _this3.deepUpdate($fields, $path, false);
      }

      if (recursion && _lodash2.default.has(field, 'fields') && !_lodash2.default.isNil(field.fields)) {
        // handle nested fields if defined
        _this3.deepUpdate(field.fields, $path);
      }
    });
  },


  /**
    Get Fields Props
   */
  get: function get() {
    var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (_lodash2.default.isNil(prop)) {
      return this.deepGet([].concat(_toConsumableArray(_utils2.default.props.booleans), _toConsumableArray(_utils2.default.props.field), _toConsumableArray(_utils2.default.props.validation)), this.fields);
    }

    _utils2.default.allowedProps('all', _lodash2.default.isArray(prop) ? prop : [prop]);

    if (_lodash2.default.isString(prop)) {
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

    return _lodash2.default.transform(_utils2.default.getObservableMapValues(fields), function (obj, field) {
      var $nested = function $nested($fields) {
        return $fields.size !== 0 ? _this4.deepGet(prop, $fields) : undefined;
      };

      Object.assign(obj, _defineProperty({}, field.key, { fields: $nested(field.fields) }));

      if (_lodash2.default.isString(prop)) {
        var removeValue = prop === 'value' && (_this4.state.options.get('retrieveOnlyDirtyValues', _this4) && field.isPristine || _this4.state.options.get('retrieveOnlyEnabledFields', _this4) && field.disabled || _this4.state.options.get('softDelete', _this4) && field.deleted);

        if (field.fields.size === 0) {
          delete obj[field.key]; // eslint-disable-line
          if (removeValue) return obj;
          return Object.assign(obj, _defineProperty({}, field.key, _parser2.default.parseCheckOutput(field, prop)));
        }

        var value = _this4.deepGet(prop, field.fields);
        if (prop === 'value') value = field.$output(value);

        delete obj[field.key]; // eslint-disable-line
        if (removeValue) return obj;

        return Object.assign(obj, _defineProperty({}, field.key, _parser2.default.parseCheckArray(field, value, prop)));
      }

      _lodash2.default.each(prop, function ($prop) {
        return Object.assign(obj[field.key], _defineProperty({}, $prop, field[$prop]));
      });

      return obj;
    }, {});
  },
  set: function set(prop, data) {
    // UPDATE CUSTOM PROP
    if (_lodash2.default.isString(prop) && !_lodash2.default.isUndefined(data)) {
      _utils2.default.allowedProps('field', [prop]);
      var deep = _lodash2.default.isObject(data) && prop === 'value' || _lodash2.default.isPlainObject(data);
      if (deep && this.hasNestedFields) this.deepSet(prop, data, '', true);else _lodash2.default.set(this, '$' + prop, data);
      return;
    }

    // NO PROP NAME PROVIDED ("prop" is value)
    if (_lodash2.default.isNil(data)) {
      if (this.hasNestedFields) this.deepSet('value', prop, '', true);else this.set('value', prop);
    }
  },


  /**
    Set Fields Props Recursively
   */
  deepSet: function deepSet($, data) {
    var _this5 = this;

    var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var recursion = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var err = 'You are updating a not existent field:';
    var isStrict = this.state.options.get('strictUpdate', this);

    if (_lodash2.default.isNil(data)) {
      this.each(function (field) {
        return field.clear(true);
      });
      return;
    }

    _lodash2.default.each(data, function ($val, $key) {
      var $path = _lodash2.default.trimStart(path + '.' + $key, '.');
      // get the field by path joining keys recursively
      var field = _this5.select($path, null, isStrict);
      // if no field found when is strict update, throw error
      if (isStrict) _utils2.default.throwError($path, field, err);
      // update the field/fields if defined
      if (!_lodash2.default.isUndefined(field)) {
        // update field values or others props
        if (!_lodash2.default.isUndefined($val)) {
          field.set($, $val, recursion);
        }
        // update values recursively only if field has nested
        if (field.fields.size && _lodash2.default.isObject($val)) {
          _this5.deepSet($, $val, $path, recursion);
        }
      }
    });
  },
  add: function add(obj) {
    var _this6 = this;

    if (_utils2.default.isArrayOfObjects(obj)) {
      return _lodash2.default.each(obj, function (values) {
        return _this6.update(_defineProperty({}, _utils2.default.maxKey(_this6.fields), values));
      });
    }

    var key = void 0; // eslint-disable-next-line
    if (_lodash2.default.has(obj, 'key')) key = obj.key;
    if (_lodash2.default.has(obj, 'name')) key = obj.name;
    if (!key) key = _utils2.default.maxKey(this.fields);

    var $path = function $path($key) {
      return _lodash2.default.trimStart([_this6.path, $key].join('.'), '.');
    };
    var tree = _parser2.default.pathToFieldsTree(this.state.struct(), this.path, 0, true);
    return this.initField(key, $path(key), _lodash2.default.merge(tree[0], obj));
  },
  del: function del() {
    var $path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var isStrict = this.state.options.get('strictDelete', this);
    var path = _parser2.default.parsePath(_utils2.default.$try($path, this.path));
    var fullpath = _lodash2.default.trim([this.path, path].join('.'), '.');
    var container = this.container($path);
    var keys = _lodash2.default.split(path, '.');
    var last = _lodash2.default.last(keys);

    if (isStrict && !container.fields.has(last)) {
      var msg = 'Key "' + last + '" not found when trying to delete field';
      _utils2.default.throwError(fullpath, null, msg);
    }

    if (this.state.options.get('softDelete', this)) {
      return this.select(fullpath).set('deleted', true);
    }

    return container.fields.delete(last);
  }
}, (_applyDecoratedDescriptor(_obj, 'submit', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'submit'), _obj), _applyDecoratedDescriptor(_obj, 'deepUpdate', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'deepUpdate'), _obj), _applyDecoratedDescriptor(_obj, 'set', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'set'), _obj), _applyDecoratedDescriptor(_obj, 'add', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'add'), _obj), _applyDecoratedDescriptor(_obj, 'del', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'del'), _obj)), _obj);
module.exports = exports['default'];