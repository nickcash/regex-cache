/*!
 * regex-cache <https://github.com/jonschlinkert/regex-cache>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function regexCache(fn, str, options) {
  var regex;
  if (str === null) { str = 'default'; }
  if (cache.hasOwnProperty(str)) {
    var cached = cache[str];
    if (equal(cached.opts, options)) {
      return cached.regex;
    }

    regex = fn(str, options);
    memo(str, options, regex);
    return regex;
  }

  regex = fn(str, options);
  memo(str, options, regex);
  return regex;
};

function memo(str, opts, regex) {
  cache[str] = {regex: regex, opts: opts};
}

var cache = module.exports.cache = {};

/**
 * Return false if object A is different (enough)
 * from object B.
 *
 * When creating the regex memoization is used
 * to increase performance. This function tells
 * us if options have changed so we can generate
 * a new regex instead of using the cached one.
 *
 * @param {Object} `a` cached options
 * @param {Object} `b` passed options
 * @return {Boolean}
 */

function equal(a, b, mode) {
  if (!a && !b) { return true; }
  if (!!a && !b) { return false; }
  if (!a && !!b) { return false; }

  // this is much faster than doiong `typeof`
  // when you know you'll always be passing
  // strings, like for regex flags etc.
  if (mode === 'string') {
    return a === b;
  }

  var ak = Object.keys(a);
  var bk = Object.keys(b);
  var alen = a.length;
  var blen = b.length;

  if (alen !== blen) {
    return false;
  }

  if (alen === 0 && blen === 0) {
    return true;
  }

  var aa = JSON.stringify(a);
  var bb = JSON.stringify(b);
  if (aa != bb) {
    return false;
  }
  return true;
}