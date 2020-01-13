'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mobx = require('mobx');

var _props = require('./props');

var _props2 = _interopRequireDefault(_props);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getObservableMapValues = function getObservableMapValues(observableMap) {
  return _mobx.values ? (0, _mobx.values)(observableMap) : observableMap.values();
};

var getObservableMapKeys = function getObservableMapKeys(observableMap) {
  return _mobx.values ? (0, _mobx.keys)(observableMap) : observableMap.keys();
};

var checkObserveItem = function checkObserveItem(change) {
  return function (_ref) {
    var key = _ref.key,
        to = _ref.to,
        type = _ref.type,
        exec = _ref.exec;
    return change.type === type && change.name === key && change.newValue === to && exec.apply(change, [change]);
  };
};

var checkObserve = function checkObserve(collection) {
  return function (change) {
    return collection.map(checkObserveItem(change));
  };
};

var checkPropType = function checkPropType(_ref2) {
  var type = _ref2.type,
      data = _ref2.data;

  var $check = void 0;
  switch (type) {
    case 'some':
      $check = function $check($data) {
        return _lodash2.default.some($data, Boolean);
      };break;
    case 'every':
      $check = function $check($data) {
        return _lodash2.default.every($data, Boolean);
      };break;
    default:
      $check = null;
  }
  return $check(data);
};

var hasProps = function hasProps($type, $data) {
  var $props = void 0;
  switch ($type) {
    case 'booleans':
      $props = _props2.default.booleans;
      break;
    case 'field':
      $props = [].concat(_toConsumableArray(_props2.default.field), _toConsumableArray(_props2.default.validation), _toConsumableArray(_props2.default.function), _toConsumableArray(_props2.default.handlers));break;
    case 'all':
      $props = ['id'].concat(_toConsumableArray(_props2.default.booleans), _toConsumableArray(_props2.default.field), _toConsumableArray(_props2.default.validation), _toConsumableArray(_props2.default.function), _toConsumableArray(_props2.default.handlers));break;
    default:
      $props = null;
  }

  return _lodash2.default.intersection($data, $props).length > 0;
};

/**
  Check Allowed Properties
*/
var allowedProps = function allowedProps(type, data) {
  if (hasProps(type, data)) return;
  var $msg = 'The selected property is not allowed';
  throw new Error($msg + ' (' + JSON.stringify(data) + ')');
};

/**
  Throw Error if undefined Fields
*/
var throwError = function throwError(path, fields) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (!_lodash2.default.isNil(fields)) return;
  var $msg = _lodash2.default.isNil(msg) ? 'The selected field is not defined' : msg;
  throw new Error($msg + ' (' + path + ')');
};

var pathToStruct = function pathToStruct(path) {
  var struct = void 0;
  struct = _lodash2.default.replace(path, new RegExp('[.]\\d+($|.)', 'g'), '[].');
  struct = _lodash2.default.replace(struct, '..', '.');
  struct = _lodash2.default.trim(struct, '.');
  return struct;
};

var hasSome = function hasSome(obj, keys) {
  return _lodash2.default.some(keys, _lodash2.default.partial(_lodash2.default.has, obj));
};

var isPromise = function isPromise(obj) {
  return !!obj && typeof obj.then === 'function' && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function');
};

var isStruct = function isStruct(struct) {
  return _lodash2.default.isArray(struct) && _lodash2.default.every(struct, _lodash2.default.isString);
};

var isEmptyArray = function isEmptyArray(field) {
  return _lodash2.default.isEmpty(field) && _lodash2.default.isArray(field);
};

var isArrayOfObjects = function isArrayOfObjects(fields) {
  return _lodash2.default.isArray(fields) && _lodash2.default.every(fields, _lodash2.default.isPlainObject);
};

var $getKeys = function $getKeys(fields) {
  return _lodash2.default.union(_lodash2.default.map(_lodash2.default.values(fields), function (values) {
    return _lodash2.default.keys(values);
  })[0]);
};

var hasUnifiedProps = function hasUnifiedProps(_ref3) {
  var fields = _ref3.fields;
  return !isStruct({ fields: fields }) && hasProps('field', $getKeys(fields));
};

var hasSeparatedProps = function hasSeparatedProps(initial) {
  return hasSome(initial, _props2.default.separated) || hasSome(initial, _props2.default.validation);
};

var allowNested = function allowNested(field, strictProps) {
  return _lodash2.default.isObject(field) && !_lodash2.default.isDate(field) && !_lodash2.default.has(field, 'fields') && (!hasSome(field, [].concat(_toConsumableArray(_props2.default.field), _toConsumableArray(_props2.default.validation), _toConsumableArray(_props2.default.function), _toConsumableArray(_props2.default.handlers))) || strictProps);
};

var parseIntKeys = function parseIntKeys(fields) {
  return _lodash2.default.map(getObservableMapKeys(fields), _lodash2.default.ary(_lodash2.default.toNumber, 1));
};

var hasIntKeys = function hasIntKeys(fields) {
  return _lodash2.default.every(parseIntKeys(fields), _lodash2.default.isInteger);
};

var maxKey = function maxKey(fields) {
  var max = _lodash2.default.max(parseIntKeys(fields));
  return _lodash2.default.isUndefined(max) ? 0 : max + 1;
};

var uniqueId = function uniqueId(field) {
  return _lodash2.default.uniqueId([_lodash2.default.replace(field.path, new RegExp('\\.', 'g'), '-'), '--'].join(''));
};

var $isEvent = function $isEvent(obj) {
  if (_lodash2.default.isNil(obj) || typeof Event === 'undefined') return false;
  return obj instanceof Event || !_lodash2.default.isNil(obj.target); // eslint-disable-line
};

var $hasFiles = function $hasFiles($) {
  return $.target.files && $.target.files.length !== 0;
};

var $isBool = function $isBool($, val) {
  return _lodash2.default.isBoolean(val) && _lodash2.default.isBoolean($.target.checked);
};

var $try = function $try() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var found = null;

  args.map(function (val) {
    return (// eslint-disable-line
      found === null && !_lodash2.default.isNil(val) && (found = val)
    );
  });

  return found;
};

exports.default = {
  props: _props2.default,
  checkObserve: checkObserve,
  checkPropType: checkPropType,
  hasProps: hasProps,
  allowedProps: allowedProps,
  throwError: throwError,
  isPromise: isPromise,
  isStruct: isStruct,
  isEmptyArray: isEmptyArray,
  isArrayOfObjects: isArrayOfObjects,
  pathToStruct: pathToStruct,
  hasUnifiedProps: hasUnifiedProps,
  hasSeparatedProps: hasSeparatedProps,
  allowNested: allowNested,
  parseIntKeys: parseIntKeys,
  hasIntKeys: hasIntKeys,
  maxKey: maxKey,
  uniqueId: uniqueId,
  $isEvent: $isEvent,
  $hasFiles: $hasFiles,
  $isBool: $isBool,
  $try: $try,
  getObservableMapKeys: getObservableMapKeys,
  getObservableMapValues: getObservableMapValues
};
module.exports = exports['default'];