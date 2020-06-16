"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _mobx = require("mobx");

var _ary = require("lodash-es/ary");

var _ary2 = _interopRequireDefault(_ary);

var _every = require("lodash-es/every");

var _every2 = _interopRequireDefault(_every);

var _has = require("lodash-es/has");

var _has2 = _interopRequireDefault(_has);

var _intersection = require("lodash-es/intersection");

var _intersection2 = _interopRequireDefault(_intersection);

var _isArray = require("lodash-es/isArray");

var _isArray2 = _interopRequireDefault(_isArray);

var _isBoolean = require("lodash-es/isBoolean");

var _isBoolean2 = _interopRequireDefault(_isBoolean);

var _isDate = require("lodash-es/isDate");

var _isDate2 = _interopRequireDefault(_isDate);

var _isEmpty = require("lodash-es/isEmpty");

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _isInteger = require("lodash-es/isInteger");

var _isInteger2 = _interopRequireDefault(_isInteger);

var _isNil = require("lodash-es/isNil");

var _isNil2 = _interopRequireDefault(_isNil);

var _isObject = require("lodash-es/isObject");

var _isObject2 = _interopRequireDefault(_isObject);

var _isPlainObject = require("lodash-es/isPlainObject");

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _isString = require("lodash-es/isString");

var _isString2 = _interopRequireDefault(_isString);

var _isUndefined = require("lodash-es/isUndefined");

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _keys = require("lodash-es/keys");

var _keys2 = _interopRequireDefault(_keys);

var _map = require("lodash-es/map");

var _map2 = _interopRequireDefault(_map);

var _max = require("lodash-es/max");

var _max2 = _interopRequireDefault(_max);

var _partial = require("lodash-es/partial");

var _partial2 = _interopRequireDefault(_partial);

var _replace = require("lodash-es/replace");

var _replace2 = _interopRequireDefault(_replace);

var _some = require("lodash-es/some");

var _some2 = _interopRequireDefault(_some);

var _toNumber = require("lodash-es/toNumber");

var _toNumber2 = _interopRequireDefault(_toNumber);

var _trim = require("lodash-es/trim");

var _trim2 = _interopRequireDefault(_trim);

var _union = require("lodash-es/union");

var _union2 = _interopRequireDefault(_union);

var _uniqueId = require("lodash-es/uniqueId");

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _values = require("lodash-es/values");

var _values2 = _interopRequireDefault(_values);

var _props = require("./props");

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
    case "some":
      $check = function $check($data) {
        return (0, _some2.default)($data, Boolean);
      };
      break;
    case "every":
      $check = function $check($data) {
        return (0, _every2.default)($data, Boolean);
      };
      break;
    default:
      $check = null;
  }
  return $check(data);
};

var hasProps = function hasProps($type, $data) {
  var $props = void 0;
  switch ($type) {
    case "booleans":
      $props = _props2.default.booleans;
      break;
    case "field":
      $props = [].concat(_toConsumableArray(_props2.default.field), _toConsumableArray(_props2.default.validation), _toConsumableArray(_props2.default.function), _toConsumableArray(_props2.default.handlers));
      break;
    case "all":
      $props = ["id"].concat(_toConsumableArray(_props2.default.booleans), _toConsumableArray(_props2.default.field), _toConsumableArray(_props2.default.validation), _toConsumableArray(_props2.default.function), _toConsumableArray(_props2.default.handlers));
      break;
    default:
      $props = null;
  }

  return (0, _intersection2.default)($data, $props).length > 0;
};

/**
  Check Allowed Properties
*/
var allowedProps = function allowedProps(type, data) {
  if (hasProps(type, data)) return;
  var $msg = "The selected property is not allowed";
  throw new Error($msg + " (" + JSON.stringify(data) + ")");
};

/**
  Throw Error if undefined Fields
*/
var throwError = function throwError(path, fields) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (!(0, _isNil2.default)(fields)) return;
  var $msg = (0, _isNil2.default)(msg) ? "The selected field is not defined" : msg;
  throw new Error($msg + " (" + path + ")");
};

var pathToStruct = function pathToStruct(path) {
  var struct = void 0;
  struct = (0, _replace2.default)(path, new RegExp("[.]\\d+($|.)", "g"), "[].");
  struct = (0, _replace2.default)(struct, "..", ".");
  struct = (0, _trim2.default)(struct, ".");
  return struct;
};

var hasSome = function hasSome(obj, keys) {
  return (0, _some2.default)(keys, (0, _partial2.default)(_has2.default, obj));
};

var isPromise = function isPromise(obj) {
  return !!obj && typeof obj.then === "function" && ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" || typeof obj === "function");
};

var isStruct = function isStruct(struct) {
  return (0, _isArray2.default)(struct) && (0, _every2.default)(struct, _isString2.default);
};

var isEmptyArray = function isEmptyArray(field) {
  return (0, _isEmpty2.default)(field) && (0, _isArray2.default)(field);
};

var isArrayOfObjects = function isArrayOfObjects(fields) {
  return (0, _isArray2.default)(fields) && (0, _every2.default)(fields, _isPlainObject2.default);
};

var $getKeys = function $getKeys(fields) {
  return (0, _union2.default)((0, _map2.default)((0, _values2.default)(fields), function (vals) {
    return (0, _keys2.default)(vals);
  })[0]);
};

var hasUnifiedProps = function hasUnifiedProps(_ref3) {
  var fields = _ref3.fields;
  return !isStruct({ fields: fields }) && hasProps("field", $getKeys(fields));
};

var hasSeparatedProps = function hasSeparatedProps(initial) {
  return hasSome(initial, _props2.default.separated) || hasSome(initial, _props2.default.validation);
};

var allowNested = function allowNested(field, strictProps) {
  return (0, _isObject2.default)(field) && !(0, _isDate2.default)(field) && !(0, _has2.default)(field, "fields") && (!hasSome(field, [].concat(_toConsumableArray(_props2.default.field), _toConsumableArray(_props2.default.validation), _toConsumableArray(_props2.default.function), _toConsumableArray(_props2.default.handlers))) || strictProps);
};

var parseIntKeys = function parseIntKeys(fields) {
  return (0, _map2.default)(getObservableMapKeys(fields), (0, _ary2.default)(_toNumber2.default, 1));
};

var hasIntKeys = function hasIntKeys(fields) {
  return (0, _every2.default)(parseIntKeys(fields), _isInteger2.default);
};

var maxKey = function maxKey(fields) {
  var maximum = (0, _max2.default)(parseIntKeys(fields));
  return (0, _isUndefined2.default)(maximum) ? 0 : maximum + 1;
};

var uId = function uId(field) {
  return (0, _uniqueId2.default)([(0, _replace2.default)(field.path, new RegExp("\\.", "g"), "-"), "--"].join(""));
};

var $isEvent = function $isEvent(obj) {
  if ((0, _isNil2.default)(obj) || typeof Event === "undefined") return false;
  return obj instanceof Event || !(0, _isNil2.default)(obj.target); // eslint-disable-line
};

var $hasFiles = function $hasFiles($) {
  return $.target.files && $.target.files.length !== 0;
};

var $isBool = function $isBool($, val) {
  return (0, _isBoolean2.default)(val) && (0, _isBoolean2.default)($.target.checked);
};

var $try = function $try() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var found = null;

  args.map(function (val // eslint-disable-line
  ) {
    return found === null && !(0, _isNil2.default)(val) && (found = val);
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
  uId: uId,
  $isEvent: $isEvent,
  $hasFiles: $hasFiles,
  $isBool: $isBool,
  $try: $try,
  getObservableMapKeys: getObservableMapKeys,
  getObservableMapValues: getObservableMapValues
};
module.exports = exports["default"];