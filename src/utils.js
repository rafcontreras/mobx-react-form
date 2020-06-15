import { values as mobxValues, keys as mobxKeys } from "mobx";
import ary from "lodash-es/ary";
import every from "lodash-es/every";
import intersection from "lodash-es/intersection";
import isArray from "lodash-es/isArray";
import isBoolean from "lodash-es/isBoolean";
import isDate from "lodash-es/isDate";
import isEmpty from "lodash-es/isEmpty";
import isInteger from "lodash-es/isInteger";
import isNil from "lodash-es/isNil";
import isObject from "lodash-es/isObject";
import isPlainObject from "lodash-es/isPlainObject";
import isString from "lodash-es/isString";
import isUndefined from "lodash-es/isUndefined";
import keys from "lodash-es/keys";
import map from "lodash-es/map";
import max from "lodash-es/max";
import partial from "lodash-es/partial";
import replace from "lodash-es/replace";
import some from "lodash-es/some";
import toNumber from "lodash-es/toNumber";
import trim from "lodash-es/trim";
import union from "lodash-es/union";
import uniqueId from "lodash-es/uniqueId";
import values from "lodash-es/values";

import props from "./props";

const getObservableMapValues = (observableMap) =>
  mobxValues ? mobxValues(observableMap) : observableMap.values();

const getObservableMapKeys = (observableMap) =>
  mobxValues ? mobxKeys(observableMap) : observableMap.keys();

const checkObserveItem = (change) => ({ key, to, type, exec }) =>
  change.type === type &&
  change.name === key &&
  change.newValue === to &&
  exec.apply(change, [change]);

const checkObserve = (collection) => (change) =>
  collection.map(checkObserveItem(change));

const checkPropType = ({ type, data }) => {
  let $check;
  switch (type) {
    case "some":
      $check = ($data) => some($data, Boolean);
      break;
    case "every":
      $check = ($data) => every($data, Boolean);
      break;
    default:
      $check = null;
  }
  return $check(data);
};

const hasProps = ($type, $data) => {
  let $props;
  switch ($type) {
    case "booleans":
      $props = props.booleans;
      break;
    case "field":
      $props = [
        ...props.field,
        ...props.validation,
        ...props.function,
        ...props.handlers,
      ];
      break;
    case "all":
      $props = [
        "id",
        ...props.booleans,
        ...props.field,
        ...props.validation,
        ...props.function,
        ...props.handlers,
      ];
      break;
    default:
      $props = null;
  }

  return intersection($data, $props).length > 0;
};

/**
  Check Allowed Properties
*/
const allowedProps = (type, data) => {
  if (hasProps(type, data)) return;
  const $msg = "The selected property is not allowed";
  throw new Error(`${$msg} (${JSON.stringify(data)})`);
};

/**
  Throw Error if undefined Fields
*/
const throwError = (path, fields, msg = null) => {
  if (!isNil(fields)) return;
  const $msg = isNil(msg) ? "The selected field is not defined" : msg;
  throw new Error(`${$msg} (${path})`);
};

const pathToStruct = (path) => {
  let struct;
  struct = replace(path, new RegExp("[.]\\d+($|.)", "g"), "[].");
  struct = replace(struct, "..", ".");
  struct = trim(struct, ".");
  return struct;
};

const hasSome = (obj, keys) => some(keys, partial(has, obj));

const isPromise = (obj) =>
  !!obj &&
  typeof obj.then === "function" &&
  (typeof obj === "object" || typeof obj === "function");

const isStruct = (struct) => isArray(struct) && every(struct, isString);

const isEmptyArray = (field) => isEmpty(field) && isArray(field);

const isArrayOfObjects = (fields) =>
  isArray(fields) && every(fields, isPlainObject);

const $getKeys = (fields) =>
  union(map(values(fields), (vals) => keys(vals))[0]);

const hasUnifiedProps = ({ fields }) =>
  !isStruct({ fields }) && hasProps("field", $getKeys(fields));

const hasSeparatedProps = (initial) =>
  hasSome(initial, props.separated) || hasSome(initial, props.validation);

const allowNested = (field, strictProps) =>
  isObject(field) &&
  !isDate(field) &&
  !has(field, "fields") &&
  (!hasSome(field, [
    ...props.field,
    ...props.validation,
    ...props.function,
    ...props.handlers,
  ]) ||
    strictProps);

const parseIntKeys = (fields) =>
  map(getObservableMapKeys(fields), ary(toNumber, 1));

const hasIntKeys = (fields) => every(parseIntKeys(fields), isInteger);

const maxKey = (fields) => {
  const maximum = max(parseIntKeys(fields));
  return isUndefined(maximum) ? 0 : maximum + 1;
};

const uId = (field) =>
  uniqueId([replace(field.path, new RegExp("\\.", "g"), "-"), "--"].join(""));

const $isEvent = (obj) => {
  if (isNil(obj) || typeof Event === "undefined") return false;
  return obj instanceof Event || !isNil(obj.target); // eslint-disable-line
};

const $hasFiles = ($) => $.target.files && $.target.files.length !== 0;

const $isBool = ($, val) => isBoolean(val) && isBoolean($.target.checked);

const $try = (...args) => {
  let found = null;

  args.map(
    (
      val // eslint-disable-line
    ) => found === null && !isNil(val) && (found = val)
  );

  return found;
};

export default {
  props,
  checkObserve,
  checkPropType,
  hasProps,
  allowedProps,
  throwError,
  isPromise,
  isStruct,
  isEmptyArray,
  isArrayOfObjects,
  pathToStruct,
  hasUnifiedProps,
  hasSeparatedProps,
  allowNested,
  parseIntKeys,
  hasIntKeys,
  maxKey,
  uId,
  $isEvent,
  $hasFiles,
  $isBool,
  $try,
  getObservableMapKeys,
  getObservableMapValues,
};
