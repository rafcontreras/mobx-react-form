import endsWith from "lodash-es/endsWith";
import filter from "lodash-es/filter";
import get from "lodash-es/get";
import isArray from "lodash-es/isArray";
import isBoolean from "lodash-es/isBoolean";
import isDate from "lodash-es/isDate";
import isEmpty from "lodash-es/isEmpty";
import isNumber from "lodash-es/isNumber";
import isPlainObject from "lodash-es/isPlainObject";
import isString from "lodash-es/isString";
import last from "lodash-es/last";
import map from "lodash-es/map";
import merge from "lodash-es/merge";
import reduceRight from "lodash-es/reduceRight";
import replace from "lodash-es/replace";
import set from "lodash-es/set";
import split from "lodash-es/split";
import startsWith from "lodash-es/startsWith";
import transform from "lodash-es/transform";
import trimEnd from "lodash-es/trimEnd";
import values from "lodash-es/values";
import without from "lodash-es/without";

import utils from "./utils";

const defaultClearValue = ({ value }) => {
  if (isArray(value)) return [];
  if (isDate(value)) return null;
  if (isBoolean(value)) return false;
  if (isNumber(value)) return 0;
  if (isString(value)) return "";
  return undefined;
};

const defaultValue = ({ type, nullable = false, isEmptyArray = false }) => {
  if (type === "date") return null;
  if (type === "datetime-local") return null;
  if (type === "checkbox") return false;
  if (type === "number") return 0;
  if (nullable) return null;
  if (isEmptyArray) return [];
  return "";
};

const parsePath = (path) => {
  let $path = path;
  $path = replace($path, new RegExp("\\[", "g"), ".");
  $path = replace($path, new RegExp("\\]", "g"), "");
  return $path;
};

const parseInput = (
  input,
  { type, isEmptyArray, nullable, separated, unified, fallback }
) =>
  input(
    utils.$try(
      separated,
      unified,
      fallback,
      defaultValue({
        type,
        isEmptyArray,
        nullable,
      })
    )
  );

const parseArrayProp = ($val, $prop) => {
  const $values = values($val);
  if ($prop === "value" || $prop === "initial" || $prop === "default") {
    return without($values, null, undefined, "");
  }
  return $values;
};

const parseCheckArray = (field, value, prop) =>
  field.hasIncrementalKeys ? parseArrayProp(value, prop) : value;

const parseCheckOutput = ($field, $prop) =>
  $prop === "value" && $field.$output
    ? $field.$output($field[$prop])
    : $field[$prop];

const defineFieldsFromStruct = (struct, add = false) =>
  reduceRight(
    struct,
    ($, name) => {
      const obj = {};
      if (endsWith(name, "[]")) {
        const val = add ? [$] : [];
        obj[trimEnd(name, "[]")] = val;
        return obj;
      }
      // no brakets
      const prev = struct[struct.indexOf(name) - 1];
      const stop = endsWith(prev, "[]") && last(struct) === name;
      if (!add && stop) return obj;
      obj[name] = $;
      return obj;
    },
    {}
  );

const handleFieldsArrayOfStrings = ($fields, add = false) => {
  let fields = $fields;
  // handle array with field struct (strings)
  if (utils.isStruct(fields)) {
    fields = transform(
      fields,
      ($obj, $) => {
        const pathStruct = split($, ".");
        // as array of strings (with empty values)
        if (!pathStruct.length) return Object.assign($obj, { [$]: "" });
        // define flat or nested fields from pathStruct
        return merge($obj, defineFieldsFromStruct(pathStruct, add));
      },
      {}
    );
  }
  return fields;
};

const handleFieldsArrayOfObjects = ($fields) => {
  let fields = $fields;
  // handle array of objects (with unified props)
  if (utils.isArrayOfObjects(fields)) {
    fields = transform(
      fields,
      ($obj, field) => {
        if (utils.hasUnifiedProps({ fields: { field } }) && !has(field, "name"))
          return undefined;
        return Object.assign($obj, { [field.name]: field });
      },
      {}
    );
  }
  return fields;
};

const handleFieldsNested = (fields, strictProps = true) =>
  transform(
    fields,
    (obj, field, key) => {
      if (utils.allowNested(field, strictProps)) {
        // define nested field
        return Object.assign(obj, {
          [key]: {
            fields: utils.isEmptyArray(field) ? [] : handleFieldsNested(field),
          },
        });
      }
      return Object.assign(obj, { [key]: field });
    },
    {}
  );

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
const mapNestedValuesToUnifiedValues = (data) =>
  isPlainObject(data)
    ? map(data, (value, name) => ({ value, name }))
    : undefined;

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
const reduceValuesToUnifiedFields = (values) =>
  transform(
    values,
    (obj, value, key) =>
      Object.assign(obj, {
        [key]: {
          value,
          fields: mapNestedValuesToUnifiedValues(value),
        },
      }),
    {}
  );

/*
  Fallback Unified Props to Sepated Mode
*/
const handleFieldsPropsFallback = (fields, initial, fallback) => {
  if (!has(initial, "values")) return fields;
  // if the 'values' object is passed in constructor
  // then update the fields definitions
  let { values } = initial;
  if (utils.hasUnifiedProps({ fields })) {
    values = reduceValuesToUnifiedFields(values);
  }
  return merge(
    fields,
    transform(
      values,
      (result, v, k) => {
        if (isArray(fields[k])) result[k] = v;
        if (!(k in fields) && (!isNaN(Number(k)) || fallback)) result[k] = v;
      },
      {}
    )
  );
};

const mergeSchemaDefaults = (fields, validator) => {
  if (validator) {
    const schema = get(validator.plugins, "svk.config.schema");
    if (isEmpty(fields) && schema && !!schema.properties) {
      each(schema.properties, (prop, key) => {
        set(fields, key, {
          value: prop.default,
          label: prop.title,
        });
      });
    }
  }
  return fields;
};

const prepareFieldsData = (initial, strictProps = true, fallback = true) => {
  let fields = merge(
    handleFieldsArrayOfStrings(initial.fields, false),
    handleFieldsArrayOfStrings(initial.struct, false)
  );

  fields = handleFieldsArrayOfObjects(fields);
  fields = handleFieldsPropsFallback(fields, initial, fallback);
  fields = handleFieldsNested(fields, strictProps);

  return fields;
};

const pathToFieldsTree = (struct, path, n = 0, add = false) => {
  const structPath = utils.pathToStruct(path);
  const structArray = filter(struct, (item) => startsWith(item, structPath));
  const $tree = handleFieldsArrayOfStrings(structArray, add);
  const $struct = replace(structPath, new RegExp("\\[]", "g"), `[${n}]`);
  return handleFieldsNested(get($tree, $struct));
};

export default {
  defaultValue,
  defaultClearValue,
  parseInput,
  parsePath,
  parseArrayProp,
  parseCheckArray,
  parseCheckOutput,
  mergeSchemaDefaults,
  handleFieldsNested,
  handleFieldsArrayOfStrings,
  prepareFieldsData,
  pathToFieldsTree,
};
