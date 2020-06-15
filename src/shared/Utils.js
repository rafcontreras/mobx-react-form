import each from "lodash-es/each";
import head from "lodash-es/head";
import isNil from "lodash-es/isNil";
import split from "lodash-es/split";
import trim from "lodash-es/trim";

import utils from "../utils";
import parser from "../parser";

/**
  Field Utils
*/
export default {
  /**
   Fields Selector
   */
  select(path, fields = null, isStrict = true) {
    const $path = parser.parsePath(path);

    const keys = split($path, ".");
    const heads = head(keys);

    keys.shift();

    let $fields = isNil(fields) ? this.fields.get(heads) : fields.get(heads);

    let stop = false;
    each(keys, ($key) => {
      if (stop) return;
      if (isNil($fields)) {
        $fields = undefined;
        stop = true;
      } else {
        $fields = $fields.fields.get($key);
      }
    });

    if (isStrict) utils.throwError(path, $fields);

    return $fields;
  },

  /**
    Get Container
   */
  container($path) {
    const path = parser.parsePath(utils.$try($path, this.path));
    const cpath = trim(path.replace(new RegExp("[^./]+$"), ""), ".");

    if (!!this.path && isNil($path)) {
      return cpath !== ""
        ? this.state.form.select(cpath, null, false)
        : this.state.form;
    }

    return cpath !== "" ? this.select(cpath, null, false) : this;
  },

  /**
    Has Field
   */
  has(path) {
    return this.fields.has(path);
  },

  /**
   Map Fields
  */
  map(cb) {
    return utils.getObservableMapValues(this.fields).map(cb);
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
  each(iteratee, fields = null, depth = 0) {
    const $fields = fields || this.fields;
    each(utils.getObservableMapValues($fields), (field, index) => {
      iteratee(field, index, depth);

      if (field.fields.size !== 0) {
        this.each(iteratee, field.fields, depth + 1);
      }
    });
  },
};
