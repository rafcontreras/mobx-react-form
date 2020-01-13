'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultClearValue = function defaultClearValue(_ref) {
  var value = _ref.value;

  if (_lodash2.default.isArray(value)) return [];
  if (_lodash2.default.isDate(value)) return null;
  if (_lodash2.default.isBoolean(value)) return false;
  if (_lodash2.default.isNumber(value)) return 0;
  if (_lodash2.default.isString(value)) return '';
  return undefined;
};

var defaultValue = function defaultValue(_ref2) {
  var type = _ref2.type,
      _ref2$nullable = _ref2.nullable,
      nullable = _ref2$nullable === undefined ? false : _ref2$nullable,
      _ref2$isEmptyArray = _ref2.isEmptyArray,
      isEmptyArray = _ref2$isEmptyArray === undefined ? false : _ref2$isEmptyArray;

  if (type === 'date') return null;
  if (type === 'checkbox') return false;
  if (type === 'number') return 0;
  if (nullable) return null;
  if (isEmptyArray) return [];
  return '';
};

var parsePath = function parsePath(path) {
  var $path = path;
  $path = _lodash2.default.replace($path, new RegExp('\\[', 'g'), '.');
  $path = _lodash2.default.replace($path, new RegExp('\\]', 'g'), '');
  return $path;
};

var parseInput = function parseInput(input, _ref3) {
  var type = _ref3.type,
      isEmptyArray = _ref3.isEmptyArray,
      nullable = _ref3.nullable,
      separated = _ref3.separated,
      unified = _ref3.unified,
      fallback = _ref3.fallback;
  return input(_utils2.default.$try(separated, unified, fallback, defaultValue({
    type: type, isEmptyArray: isEmptyArray, nullable: nullable
  })));
};

var parseArrayProp = function parseArrayProp($val, $prop) {
  var $values = _lodash2.default.values($val);
  if ($prop === 'value' || $prop === 'initial' || $prop === 'default') {
    return _lodash2.default.without($values, null, undefined, '');
  }
  return $values;
};

var parseCheckArray = function parseCheckArray(field, value, prop) {
  return field.hasIncrementalKeys ? parseArrayProp(value, prop) : value;
};

var parseCheckOutput = function parseCheckOutput($field, $prop) {
  return $prop === 'value' && $field.$output ? $field.$output($field[$prop]) : $field[$prop];
};

var defineFieldsFromStruct = function defineFieldsFromStruct(struct) {
  var add = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return _lodash2.default.reduceRight(struct, function ($, name) {
    var obj = {};
    if (_lodash2.default.endsWith(name, '[]')) {
      var val = add ? [$] : [];
      obj[_lodash2.default.trimEnd(name, '[]')] = val;
      return obj;
    }
    // no brakets
    var prev = struct[struct.indexOf(name) - 1];
    var stop = _lodash2.default.endsWith(prev, '[]') && _lodash2.default.last(struct) === name;
    if (!add && stop) return obj;
    obj[name] = $;
    return obj;
  }, {});
};

var handleFieldsArrayOfStrings = function handleFieldsArrayOfStrings($fields) {
  var add = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var fields = $fields;
  // handle array with field struct (strings)
  if (_utils2.default.isStruct(fields)) {
    fields = _lodash2.default.transform(fields, function ($obj, $) {
      var pathStruct = _lodash2.default.split($, '.');
      // as array of strings (with empty values)
      if (!pathStruct.length) return Object.assign($obj, _defineProperty({}, $, ''));
      // define flat or nested fields from pathStruct
      return _lodash2.default.merge($obj, defineFieldsFromStruct(pathStruct, add));
    }, {});
  }
  return fields;
};

var handleFieldsArrayOfObjects = function handleFieldsArrayOfObjects($fields) {
  var fields = $fields;
  // handle array of objects (with unified props)
  if (_utils2.default.isArrayOfObjects(fields)) {
    fields = _lodash2.default.transform(fields, function ($obj, field) {
      if (_utils2.default.hasUnifiedProps({ fields: { field: field } }) && !_lodash2.default.has(field, 'name')) return undefined;
      return Object.assign($obj, _defineProperty({}, field.name, field));
    }, {});
  }
  return fields;
};

var handleFieldsNested = function handleFieldsNested(fields) {
  var strictProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return _lodash2.default.transform(fields, function (obj, field, key) {
    if (_utils2.default.allowNested(field, strictProps)) {
      // define nested field
      return Object.assign(obj, _defineProperty({}, key, { fields: _utils2.default.isEmptyArray(field) ? [] : handleFieldsNested(field) }));
    }
    return Object.assign(obj, _defineProperty({}, key, field));
  }, {});
};

/* mapNestedValuesToUnifiedValues

FROM:

{
  street: '123 Fake St.',
  zip: '12345',
}

TO:

[{
  name: 'street'
  value: '123 Fake St.',
}, {
  name: 'zip'
  value: '12345',
}]

*/
var mapNestedValuesToUnifiedValues = function mapNestedValuesToUnifiedValues(data) {
  return _lodash2.default.isPlainObject(data) ? _lodash2.default.map(data, function (value, name) {
    return { value: value, name: name };
  }) : undefined;
};

/* reduceValuesToUnifiedFields

FROM:

{
  name: 'fatty',
  address: {
    street: '123 Fake St.',
    zip: '12345',
  },
};

TO:

{
  name: {
    value: 'fatty',
    fields: undefined
  },
  address: {
    value: {
      street: '123 Fake St.',
      zip: '12345'
    },
    fields: [ ... ]
  },
};

*/
var reduceValuesToUnifiedFields = function reduceValuesToUnifiedFields(values) {
  return _lodash2.default.transform(values, function (obj, value, key) {
    return Object.assign(obj, _defineProperty({}, key, {
      value: value,
      fields: mapNestedValuesToUnifiedValues(value)
    }));
  }, {});
};

/*
  Fallback Unified Props to Sepated Mode
*/
var handleFieldsPropsFallback = function handleFieldsPropsFallback(fields, initial) {
  if (!_lodash2.default.has(initial, 'values')) return fields;
  // if the 'values' object is passed in constructor
  // then update the fields definitions
  var values = initial.values;

  if (_utils2.default.hasUnifiedProps({ fields: fields })) {
    values = reduceValuesToUnifiedFields(values);
  }
  return _lodash2.default.merge(fields, _lodash2.default.transform(values, function (result, v, k) {
    if (!(k in fields) || _lodash2.default.isArray(fields[k])) result[k] = v;
  }, {}));
};

var mergeSchemaDefaults = function mergeSchemaDefaults(fields, validator) {
  if (validator) {
    var schema = _lodash2.default.get(validator.plugins, 'svk.config.schema');
    if (_lodash2.default.isEmpty(fields) && schema && !!schema.properties) {
      _lodash2.default.each(schema.properties, function (prop, key) {
        _lodash2.default.set(fields, key, {
          value: prop.default,
          label: prop.title
        });
      });
    }
  }
  return fields;
};

var prepareFieldsData = function prepareFieldsData(initial) {
  var strictProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var fields = _lodash2.default.merge(handleFieldsArrayOfStrings(initial.fields, false), handleFieldsArrayOfStrings(initial.struct, false));

  fields = handleFieldsArrayOfObjects(fields);
  fields = handleFieldsPropsFallback(fields, initial);
  fields = handleFieldsNested(fields, strictProps);

  return fields;
};

var pathToFieldsTree = function pathToFieldsTree(struct, path) {
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var add = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var structPath = _utils2.default.pathToStruct(path);
  var structArray = _lodash2.default.filter(struct, function (item) {
    return _lodash2.default.startsWith(item, structPath);
  });
  var $tree = handleFieldsArrayOfStrings(structArray, add);
  var $struct = _lodash2.default.replace(structPath, new RegExp('\\[]', 'g'), '[' + n + ']');
  return handleFieldsNested(_lodash2.default.get($tree, $struct));
};

exports.default = {
  defaultValue: defaultValue,
  defaultClearValue: defaultClearValue,
  parseInput: parseInput,
  parsePath: parsePath,
  parseArrayProp: parseArrayProp,
  parseCheckArray: parseCheckArray,
  parseCheckOutput: parseCheckOutput,
  mergeSchemaDefaults: mergeSchemaDefaults,
  handleFieldsNested: handleFieldsNested,
  handleFieldsArrayOfStrings: handleFieldsArrayOfStrings,
  prepareFieldsData: prepareFieldsData,
  pathToFieldsTree: pathToFieldsTree
};
module.exports = exports['default'];