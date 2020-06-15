"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _each2 = require("lodash-es/each");

var _each3 = _interopRequireDefault(_each2);

var _head = require("lodash-es/head");

var _head2 = _interopRequireDefault(_head);

var _isNil = require("lodash-es/isNil");

var _isNil2 = _interopRequireDefault(_isNil);

var _split = require("lodash-es/split");

var _split2 = _interopRequireDefault(_split);

var _trim = require("lodash-es/trim");

var _trim2 = _interopRequireDefault(_trim);

var _utils = require("../utils");

var _utils2 = _interopRequireDefault(_utils);

var _parser = require("../parser");

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  Field Utils
*/
exports.default = {
  /**
   Fields Selector
   */
  select: function select(path) {
    var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var isStrict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var $path = _parser2.default.parsePath(path);

    var keys = (0, _split2.default)($path, ".");
    var heads = (0, _head2.default)(keys);

    keys.shift();

    var $fields = (0, _isNil2.default)(fields) ? this.fields.get(heads) : fields.get(heads);

    var stop = false;
    (0, _each3.default)(keys, function ($key) {
      if (stop) return;
      if ((0, _isNil2.default)($fields)) {
        $fields = undefined;
        stop = true;
      } else {
        $fields = $fields.fields.get($key);
      }
    });

    if (isStrict) _utils2.default.throwError(path, $fields);

    return $fields;
  },


  /**
    Get Container
   */
  container: function container($path) {
    var path = _parser2.default.parsePath(_utils2.default.$try($path, this.path));
    var cpath = (0, _trim2.default)(path.replace(new RegExp("[^./]+$"), ""), ".");

    if (!!this.path && (0, _isNil2.default)($path)) {
      return cpath !== "" ? this.state.form.select(cpath, null, false) : this.state.form;
    }

    return cpath !== "" ? this.select(cpath, null, false) : this;
  },


  /**
    Has Field
   */
  has: function has(path) {
    return this.fields.has(path);
  },


  /**
   Map Fields
  */
  map: function map(cb) {
    return _utils2.default.getObservableMapValues(this.fields).map(cb);
  },


  /**
   * Iterates deeply over fields and invokes `iteratee` for each element.
   * The iteratee is invoked with three arguments: (value, index|key, depth).
   *
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Array|Object} [fields=form.fields] fields to iterate over.
   * @param {number} [depth=1] The recursion depth for internal use.
   * @returns {Array} Returns [fields.values()] of input [fields] parameter.
   * @example
   *
   * JSON.stringify(form)
   * // => {
   *   "fields": {
   *     "state": {
   *       "fields": {
   *         "city": {
   *           "fields": { "places": {
   *                "fields": {},
   *                "key": "places", "path": "state.city.places", "$value": "NY Places"
   *              }
   *           },
   *           "key": "city", "path": "state.city", "$value": "New York"
   *         }
   *       },
   *       "key": "state", "path": "state", "$value": "USA"
   *     }
   *   }
   * }
   *
   * const data = {};
   * form.each(field => data[field.path] = field.value);
   * // => {
   *   "state": "USA",
   *   "state.city": "New York",
   *   "state.city.places": "NY Places"
   * }
   *
   */
  each: function each(iteratee) {
    var _this = this;

    var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var $fields = fields || this.fields;
    (0, _each3.default)(_utils2.default.getObservableMapValues($fields), function (field, index) {
      iteratee(field, index, depth);

      if (field.fields.size !== 0) {
        _this.each(iteratee, field.fields, depth + 1);
      }
    });
  }
};
module.exports = exports["default"];