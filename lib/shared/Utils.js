'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _parser = require('../parser');

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

    var keys = _lodash2.default.split($path, '.');
    var head = _lodash2.default.head(keys);

    keys.shift();

    var $fields = _lodash2.default.isNil(fields) ? this.fields.get(head) : fields.get(head);

    var stop = false;
    _lodash2.default.each(keys, function ($key) {
      if (stop) return;
      if (_lodash2.default.isNil($fields)) {
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
    var cpath = _lodash2.default.trim(path.replace(new RegExp('[^./]+$'), ''), '.');

    if (!!this.path && _lodash2.default.isNil($path)) {
      return cpath !== '' ? this.state.form.select(cpath, null, false) : this.state.form;
    }

    return cpath !== '' ? this.select(cpath, null, false) : this;
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
    _lodash2.default.each(_utils2.default.getObservableMapValues($fields), function (field, index) {
      iteratee(field, index, depth);

      if (field.fields.size !== 0) {
        _this.each(iteratee, field.fields, depth + 1);
      }
    });
  }
};
module.exports = exports['default'];