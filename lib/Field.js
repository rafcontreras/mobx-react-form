'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prototypes = exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _desc2, _value2, _obj;

var _mobx = require('mobx');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Base2 = require('./Base');

var _Base3 = _interopRequireDefault(_Base2);

var _utils = require('./utils');

var _parser = require('./parser');

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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var setupFieldProps = function setupFieldProps(instance, props, data) {
  return Object.assign(instance, {
    $label: props.$label || data.label || '',
    $placeholder: props.$placeholder || data.placeholder || '',
    $disabled: props.$disabled || data.disabled || false,
    $bindings: props.$bindings || data.bindings || 'default',
    $related: props.$related || data.related || [],
    $validators: (0, _mobx.toJS)(props.$validators || data.validators || null),
    $validatedWith: props.$validatedWith || data.validatedWith || 'value',
    $rules: props.$rules || data.rules || null,
    $observers: props.$observers || data.observers || null,
    $interceptors: props.$interceptors || data.interceptors || null,
    $extra: props.$extra || data.extra || null,
    $options: props.$options || data.options || {},
    $hooks: props.$hooks || data.hooks || {},
    $handlers: props.$handlers || data.handlers || {}
  });
};

var setupDefaultProp = function setupDefaultProp(instance, data, props, update, _ref) {
  var isEmptyArray = _ref.isEmptyArray;
  return (0, _parser.parseInput)(instance.$input, {
    nullable: true,
    isEmptyArray: isEmptyArray,
    type: instance.type,
    unified: update ? '' : data.default,
    separated: props.$default,
    fallback: instance.$initial
  });
};

var Field = (_class = function (_Base) {
  _inherits(Field, _Base);

  function Field(_ref2) {
    var key = _ref2.key,
        path = _ref2.path,
        _ref2$data = _ref2.data,
        data = _ref2$data === undefined ? {} : _ref2$data,
        _ref2$props = _ref2.props,
        props = _ref2$props === undefined ? {} : _ref2$props,
        _ref2$update = _ref2.update,
        update = _ref2$update === undefined ? false : _ref2$update,
        state = _ref2.state;

    _classCallCheck(this, Field);

    var _this = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this));

    _this.fields = _mobx.observable.map ? _mobx.observable.map({}) : (0, _mobx.asMap)({});
    _this.hasInitialNestedFields = false;
    _this.incremental = false;
    _this.$hooks = {};
    _this.$handlers = {};

    _this.$input = function ($) {
      return $;
    };

    _this.$output = function ($) {
      return $;
    };

    _initDefineProp(_this, '$options', _descriptor, _this);

    _initDefineProp(_this, '$value', _descriptor2, _this);

    _initDefineProp(_this, '$type', _descriptor3, _this);

    _initDefineProp(_this, '$label', _descriptor4, _this);

    _initDefineProp(_this, '$placeholder', _descriptor5, _this);

    _initDefineProp(_this, '$default', _descriptor6, _this);

    _initDefineProp(_this, '$initial', _descriptor7, _this);

    _initDefineProp(_this, '$bindings', _descriptor8, _this);

    _initDefineProp(_this, '$extra', _descriptor9, _this);

    _initDefineProp(_this, '$related', _descriptor10, _this);

    _initDefineProp(_this, '$validatedWith', _descriptor11, _this);

    _initDefineProp(_this, '$validators', _descriptor12, _this);

    _initDefineProp(_this, '$rules', _descriptor13, _this);

    _initDefineProp(_this, '$disabled', _descriptor14, _this);

    _initDefineProp(_this, '$focused', _descriptor15, _this);

    _initDefineProp(_this, '$touched', _descriptor16, _this);

    _initDefineProp(_this, '$changed', _descriptor17, _this);

    _initDefineProp(_this, '$blurred', _descriptor18, _this);

    _initDefineProp(_this, '$deleted', _descriptor19, _this);

    _initDefineProp(_this, '$clearing', _descriptor20, _this);

    _initDefineProp(_this, '$resetting', _descriptor21, _this);

    _initDefineProp(_this, 'autoFocus', _descriptor22, _this);

    _initDefineProp(_this, 'showError', _descriptor23, _this);

    _initDefineProp(_this, 'errorSync', _descriptor24, _this);

    _initDefineProp(_this, 'errorAsync', _descriptor25, _this);

    _initDefineProp(_this, 'validationErrorStack', _descriptor26, _this);

    _initDefineProp(_this, 'validationFunctionsData', _descriptor27, _this);

    _initDefineProp(_this, 'validationAsyncData', _descriptor28, _this);

    _initDefineProp(_this, 'files', _descriptor29, _this);

    _this.sync = (0, _mobx.action)(function (e) {
      var v = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      _this.$changed = true;

      var $get = function $get($) {
        return (0, _utils.$isBool)($, _this.value) ? $.target.checked : $.target.value;
      };

      // assume "v" or "e" are the values
      if (_lodash2.default.isNil(e) || _lodash2.default.isNil(e.target)) {
        if (!_lodash2.default.isNil(v) && !_lodash2.default.isNil(v.target)) {
          v = $get(v); // eslint-disable-line
        }

        _this.value = (0, _utils.$try)(e, v);
        return;
      }

      if (!_lodash2.default.isNil(e.target)) {
        _this.value = $get(e);
        return;
      }

      _this.value = e;
    });

    _this.onChange = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _this.type === 'file' ? _this.onDrop.apply(_this, args) : _this.execHandler('onChange', args, _this.sync);
    };

    _this.onToggle = function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _this.execHandler('onToggle', args, _this.sync);
    };

    _this.onBlur = function () {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return _this.execHandler('onBlur', args, (0, _mobx.action)(function () {
        if (!_this.$blurred) {
          _this.$blurred = true;
        }

        _this.$focused = false;
      }));
    };

    _this.onFocus = function () {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return _this.execHandler('onFocus', args, (0, _mobx.action)(function () {
        _this.$focused = true;
        _this.$touched = true;
      }));
    };

    _this.onDrop = function () {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return _this.execHandler('onDrop', args, (0, _mobx.action)(function () {
        var e = args[0];
        var files = null;

        if ((0, _utils.$isEvent)(e) && (0, _utils.$hasFiles)(e)) {
          files = _lodash2.default.map(e.target.files);
        }

        _this.files = files || args;
      }));
    };

    _this.state = state;

    _this.setupField(key, path, data, props, update);
    _this.checkValidationPlugins();
    _this.initNestedFields(data, update);

    _this.incremental = _this.hasIncrementalKeys !== 0;

    _this.debouncedValidation = _lodash2.default.debounce(_this.validate, _this.state.options.get('validationDebounceWait', _this), _this.state.options.get('validationDebounceOptions', _this));

    _this.observeValidationOnBlur();
    _this.observeValidationOnChange();

    _this.initMOBXEvent('observers');
    _this.initMOBXEvent('interceptors');

    _this.execHook('onInit');
    return _this;
  }

  /* ------------------------------------------------------------------ */
  /* COMPUTED */

  _createClass(Field, [{
    key: 'checkValidationErrors',
    get: function get() {
      return this.validationAsyncData.valid === false && !_lodash2.default.isEmpty(this.validationAsyncData) || !_lodash2.default.isEmpty(this.validationErrorStack) || _lodash2.default.isString(this.errorAsync) || _lodash2.default.isString(this.errorSync);
    }
  }, {
    key: 'checked',
    get: function get() {
      return this.type === 'checkbox' ? this.value : undefined;
    }
  }, {
    key: 'value',
    get: function get() {
      return this.getComputedProp('value');
    },
    set: function set(newVal) {
      if (this.$value === newVal) return;
      // handle numbers
      if (this.state.options.get('autoParseNumbers', this) === true) {
        if (_lodash2.default.isNumber(this.$initial)) {
          if (new RegExp('^-?\\d+(,\\d+)*(\\.\\d+([eE]\\d+)?)?$', 'g').exec(newVal)) {
            this.$value = _lodash2.default.toNumber(newVal);
            return;
          }
        }
      }
      // handle parse value
      this.$value = newVal;
    }
  }, {
    key: 'initial',
    get: function get() {
      return this.$initial ? (0, _mobx.toJS)(this.$initial) : this.getComputedProp('initial');
    },
    set: function set(val) {
      this.$initial = (0, _parser.parseInput)(this.$input, { separated: val });
    }
  }, {
    key: 'default',
    get: function get() {
      return this.$default ? (0, _mobx.toJS)(this.$default) : this.getComputedProp('default');
    },
    set: function set(val) {
      this.$default = (0, _parser.parseInput)(this.$input, { separated: val });
    }
  }, {
    key: 'actionRunning',
    get: function get() {
      return this.submitting || this.clearing || this.resetting;
    }
  }, {
    key: 'type',
    get: function get() {
      return (0, _mobx.toJS)(this.$type);
    }
  }, {
    key: 'label',
    get: function get() {
      return (0, _mobx.toJS)(this.$label);
    }
  }, {
    key: 'placeholder',
    get: function get() {
      return (0, _mobx.toJS)(this.$placeholder);
    }
  }, {
    key: 'extra',
    get: function get() {
      return (0, _mobx.toJS)(this.$extra);
    }
  }, {
    key: 'options',
    get: function get() {
      return (0, _mobx.toJS)(this.$options);
    }
  }, {
    key: 'bindings',
    get: function get() {
      return (0, _mobx.toJS)(this.$bindings);
    }
  }, {
    key: 'related',
    get: function get() {
      return (0, _mobx.toJS)(this.$related);
    }
  }, {
    key: 'disabled',
    get: function get() {
      return (0, _mobx.toJS)(this.$disabled);
    }
  }, {
    key: 'rules',
    get: function get() {
      return (0, _mobx.toJS)(this.$rules);
    }
  }, {
    key: 'validators',
    get: function get() {
      return (0, _mobx.toJS)(this.$validators);
    }
  }, {
    key: 'validatedValue',
    get: function get() {
      return (0, _parser.parseCheckOutput)(this, this.$validatedWith);
    }
  }, {
    key: 'error',
    get: function get() {
      if (this.showError === false) return null;
      return this.errorAsync || this.errorSync || null;
    }
  }, {
    key: 'hasError',
    get: function get() {
      return this.checkValidationErrors || this.check('hasError', true);
    }
  }, {
    key: 'isValid',
    get: function get() {
      return !this.checkValidationErrors && this.check('isValid', true);
    }
  }, {
    key: 'isDefault',
    get: function get() {
      return !_lodash2.default.isNil(this.default) && _lodash2.default.isEqual(this.default, this.value);
    }
  }, {
    key: 'isDirty',
    get: function get() {
      return !_lodash2.default.isNil(this.initial) && !_lodash2.default.isEqual(this.initial, this.value);
    }
  }, {
    key: 'isPristine',
    get: function get() {
      return !_lodash2.default.isNil(this.initial) && _lodash2.default.isEqual(this.initial, this.value);
    }
  }, {
    key: 'isEmpty',
    get: function get() {
      if (this.hasNestedFields) return this.check('isEmpty', true);
      if (_lodash2.default.isBoolean(this.value)) return !!this.$value;
      if (_lodash2.default.isNumber(this.value)) return false;
      if (_lodash2.default.isDate(this.value)) return false;
      return _lodash2.default.isEmpty(this.value);
    }
  }, {
    key: 'resetting',
    get: function get() {
      return this.hasNestedFields ? this.check('resetting', true) : this.$resetting;
    }
  }, {
    key: 'clearing',
    get: function get() {
      return this.hasNestedFields ? this.check('clearing', true) : this.$clearing;
    }
  }, {
    key: 'focused',
    get: function get() {
      return this.hasNestedFields ? this.check('focused', true) : this.$focused;
    }
  }, {
    key: 'blurred',
    get: function get() {
      return this.hasNestedFields ? this.check('blurred', true) : this.$blurred;
    }
  }, {
    key: 'touched',
    get: function get() {
      return this.hasNestedFields ? this.check('touched', true) : this.$touched;
    }
  }, {
    key: 'changed',
    get: function get() {
      return this.hasNestedFields ? this.check('changed', true) : this.$changed;
    }
  }, {
    key: 'deleted',
    get: function get() {
      return this.hasNestedFields ? this.check('deleted', true) : this.$deleted;
    }

    /* ------------------------------------------------------------------ */
    /* EVENTS HANDLERS */

  }]);

  return Field;
}(_Base3.default), (_descriptor = _applyDecoratedDescriptor(_class.prototype, '$options', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, '$value', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, '$type', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, '$label', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, '$placeholder', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, '$default', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, '$initial', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, '$bindings', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, '$extra', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, '$related', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, '$validatedWith', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, '$validators', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor13 = _applyDecoratedDescriptor(_class.prototype, '$rules', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor14 = _applyDecoratedDescriptor(_class.prototype, '$disabled', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class.prototype, '$focused', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class.prototype, '$touched', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class.prototype, '$changed', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class.prototype, '$blurred', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class.prototype, '$deleted', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor20 = _applyDecoratedDescriptor(_class.prototype, '$clearing', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor21 = _applyDecoratedDescriptor(_class.prototype, '$resetting', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor22 = _applyDecoratedDescriptor(_class.prototype, 'autoFocus', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor23 = _applyDecoratedDescriptor(_class.prototype, 'showError', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor24 = _applyDecoratedDescriptor(_class.prototype, 'errorSync', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor25 = _applyDecoratedDescriptor(_class.prototype, 'errorAsync', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor26 = _applyDecoratedDescriptor(_class.prototype, 'validationErrorStack', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor27 = _applyDecoratedDescriptor(_class.prototype, 'validationFunctionsData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor28 = _applyDecoratedDescriptor(_class.prototype, 'validationAsyncData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor29 = _applyDecoratedDescriptor(_class.prototype, 'files', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class.prototype, 'checkValidationErrors', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'checkValidationErrors'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'checked', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'checked'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'value', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'value'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'initial', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'initial'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'default', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'default'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'actionRunning', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'actionRunning'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'type', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'type'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'label', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'label'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'placeholder', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'placeholder'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'extra', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'extra'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'options', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'options'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'bindings', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'bindings'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'related', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'related'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'disabled', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'disabled'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'rules', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'rules'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'validators', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'validators'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'validatedValue', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'validatedValue'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'error', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'error'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'hasError', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'hasError'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'isValid', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'isValid'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'isDefault', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'isDefault'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'isDirty', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'isDirty'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'isPristine', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'isPristine'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'isEmpty', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'isEmpty'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'resetting', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'resetting'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'clearing', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'clearing'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'focused', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'focused'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'blurred', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'blurred'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'touched', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'touched'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'changed', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'changed'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'deleted', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'deleted'), _class.prototype)), _class);

/**
  Prototypes
*/

exports.default = Field;
var prototypes = exports.prototypes = (_obj = {
  setupField: function setupField($key, $path, $data, $props, update) {
    this.key = $key;
    this.path = $path;
    this.id = this.state.options.get('uniqueId').apply(this, [this]);
    var isEmptyArray = _lodash2.default.has($data, 'fields') && _lodash2.default.isArray($data.fields);
    var $type = $props.$type,
        $input = $props.$input,
        $output = $props.$output;

    // eslint-disable-next-line

    if (_lodash2.default.isNil($data)) $data = '';

    if (_lodash2.default.isPlainObject($data)) {
      var _$data = $data,
          type = _$data.type,
          input = _$data.input,
          output = _$data.output;


      this.name = _lodash2.default.toString($data.name || $key);
      this.$type = $type || type || 'text';
      this.$input = (0, _utils.$try)($input, input, this.$input);
      this.$output = (0, _utils.$try)($output, output, this.$output);

      this.$value = (0, _parser.parseInput)(this.$input, {
        isEmptyArray: isEmptyArray,
        type: this.type,
        unified: $data.value,
        separated: $props.$value,
        fallback: $props.$initial
      });

      this.$initial = (0, _parser.parseInput)(this.$input, {
        nullable: true,
        isEmptyArray: isEmptyArray,
        type: this.type,
        unified: $data.initial,
        separated: $props.$initial,
        fallback: this.$value
      });

      this.$default = setupDefaultProp(this, $data, $props, update, {
        isEmptyArray: isEmptyArray
      });

      setupFieldProps(this, $props, $data);
      return;
    }

    /* The field IS the value here */
    this.name = _lodash2.default.toString($key);
    this.$type = $type || 'text';
    this.$input = (0, _utils.$try)($input, this.$input);
    this.$output = (0, _utils.$try)($output, this.$output);

    this.$value = (0, _parser.parseInput)(this.$input, {
      isEmptyArray: isEmptyArray,
      type: this.type,
      unified: $data,
      separated: $props.$value
    });

    this.$initial = (0, _parser.parseInput)(this.$input, {
      nullable: true,
      isEmptyArray: isEmptyArray,
      type: this.type,
      unified: $data,
      separated: $props.$initial,
      fallback: this.$value
    });

    this.$default = setupDefaultProp(this, $data, $props, update, {
      isEmptyArray: isEmptyArray
    });

    setupFieldProps(this, $props, $data);
  },
  getComputedProp: function getComputedProp(key) {
    var _this2 = this;

    if (this.incremental || this.hasNestedFields) {
      var $val = key === 'value' ? this.get(key, false) : (0, _mobx.untracked)(function () {
        return _this2.get(key, false);
      });

      return !_lodash2.default.isEmpty($val) ? $val : [];
    }

    var val = this['$' + key];

    if (_lodash2.default.isArray(val) || (0, _mobx.isObservableArray)(val)) {
      return [].slice.call(val);
    }

    return (0, _mobx.toJS)(val);
  },
  checkValidationPlugins: function checkValidationPlugins() {
    var drivers = this.state.form.validator.drivers;

    var form = this.state.form.name ? this.state.form.name + '/' : '';

    if (_lodash2.default.isNil(drivers.dvr) && !_lodash2.default.isNil(this.rules)) {
      throw new Error('The DVR validation rules are defined but no DVR plugin provided. Field: "' + (form + this.path) + '".');
    }

    if (_lodash2.default.isNil(drivers.vjf) && !_lodash2.default.isNil(this.validators)) {
      throw new Error('The VJF validators functions are defined but no VJF plugin provided. Field: "' + (form + this.path) + '".');
    }
  },
  initNestedFields: function initNestedFields(field, update) {
    var fields = _lodash2.default.isNil(field) ? null : field.fields;

    if (_lodash2.default.isArray(fields) && !_lodash2.default.isEmpty(fields)) {
      this.hasInitialNestedFields = true;
    }

    this.initFields({ fields: fields }, update);
  },
  invalidate: function invalidate(message) {
    var async = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (async === true) {
      this.errorAsync = message;
      return;
    }

    if (_lodash2.default.isArray(message)) {
      this.validationErrorStack = message;
      this.showErrors(true);
      return;
    }

    this.validationErrorStack.unshift(message);
    this.showErrors(true);
  },
  setValidationAsyncData: function setValidationAsyncData() {
    var valid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    this.validationAsyncData = { valid: valid, message: message };
  },
  resetValidation: function resetValidation() {
    var deep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    this.showError = true;
    this.errorSync = null;
    this.errorAsync = null;
    this.validationAsyncData = {};
    this.validationFunctionsData = [];
    this.validationErrorStack = [];
    if (deep) this.each(function (field) {
      return field.resetValidation();
    });
  },
  clear: function clear() {
    var deep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    this.$clearing = true;
    this.$touched = false;
    this.$changed = false;
    this.$blurred = false;

    this.$value = (0, _parser.defaultClearValue)({ value: this.$value });
    this.files = undefined;

    if (deep) this.each(function (field) {
      return field.clear(true);
    });

    this.validate({
      showErrors: this.state.options.get('showErrorsOnClear', this)
    });
  },
  reset: function reset() {
    var deep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    this.$resetting = true;
    this.$touched = false;
    this.$changed = false;
    this.$blurred = false;

    var useDefaultValue = this.$default !== this.$initial;
    if (useDefaultValue) this.value = this.$default;
    if (!useDefaultValue) this.value = this.$initial;
    this.files = undefined;

    if (deep) this.each(function (field) {
      return field.reset(true);
    });

    this.validate({
      showErrors: this.state.options.get('showErrorsOnReset', this)
    });
  },
  focus: function focus() {
    // eslint-disable-next-line
    this.state.form.each(function (field) {
      return field.autoFocus = false;
    });
    this.autoFocus = true;
  },
  showErrors: function showErrors() {
    var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    this.showError = show;
    this.errorSync = _lodash2.default.head(this.validationErrorStack);
    this.each(function (field) {
      return field.showErrors(show);
    });
  },
  showAsyncErrors: function showAsyncErrors() {
    if (this.validationAsyncData.valid === false) {
      this.errorAsync = this.validationAsyncData.message;
      return;
    }
    this.errorAsync = null;
  },
  observeValidationOnBlur: function observeValidationOnBlur() {
    var _this3 = this;

    var opt = this.state.options;
    if (opt.get('validateOnBlur', this)) {
      this.disposeValidationOnBlur = (0, _mobx.observe)(this, '$focused', function (change) {
        return change.newValue === false && _this3.debouncedValidation({
          showErrors: opt.get('showErrorsOnBlur', _this3)
        });
      });
    }
  },
  observeValidationOnChange: function observeValidationOnChange() {
    var _this4 = this;

    var opt = this.state.options;
    if (opt.get('validateOnChange', this)) {
      this.disposeValidationOnChange = (0, _mobx.observe)(this, '$value', function () {
        return !_this4.actionRunning && _this4.debouncedValidation({
          showErrors: opt.get('showErrorsOnChange', _this4)
        });
      });
    } else if (opt.get('validateOnChangeAfterInitialBlur', this) || opt.get('validateOnChangeAfterSubmit', this)) {
      this.disposeValidationOnChange = (0, _mobx.observe)(this, '$value', function () {
        return !_this4.actionRunning && (opt.get('validateOnChangeAfterInitialBlur', _this4) && _this4.blurred || opt.get('validateOnChangeAfterSubmit', _this4) && _this4.state.form.submitted) && _this4.debouncedValidation({
          showErrors: opt.get('showErrorsOnChange', _this4)
        });
      });
    }
  },
  initMOBXEvent: function initMOBXEvent(type) {
    if (!_lodash2.default.isArray(this['$' + type])) return;

    var fn = void 0;
    if (type === 'observers') fn = this.observe;
    if (type === 'interceptors') fn = this.intercept;
    this['$' + type].map(function (obj) {
      return fn(_lodash2.default.omit(obj, 'path'));
    });
  },
  bind: function bind() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return this.state.bindings.load(this, this.bindings, props);
  }
}, (_applyDecoratedDescriptor(_obj, 'setupField', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'setupField'), _obj), _applyDecoratedDescriptor(_obj, 'initNestedFields', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'initNestedFields'), _obj), _applyDecoratedDescriptor(_obj, 'invalidate', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'invalidate'), _obj), _applyDecoratedDescriptor(_obj, 'setValidationAsyncData', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'setValidationAsyncData'), _obj), _applyDecoratedDescriptor(_obj, 'resetValidation', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'resetValidation'), _obj), _applyDecoratedDescriptor(_obj, 'clear', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'clear'), _obj), _applyDecoratedDescriptor(_obj, 'reset', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'reset'), _obj), _applyDecoratedDescriptor(_obj, 'focus', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'focus'), _obj), _applyDecoratedDescriptor(_obj, 'showErrors', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'showErrors'), _obj), _applyDecoratedDescriptor(_obj, 'showAsyncErrors', [_mobx.action], Object.getOwnPropertyDescriptor(_obj, 'showAsyncErrors'), _obj)), _obj);