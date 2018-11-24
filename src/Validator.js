const Rule = require('./Rule');

function traverse(o, fn, p) {
  let path = p || '';

  Object.keys(o).forEach((i) => {
    if (o[i] !== null && typeof (o[i]) === 'object' && !(o[i] instanceof Rule)) {
      traverse(o[i], fn, `${path}.${i}`);
    } else {
      fn.apply(null, [o[i], `${path}.${i}`.substr(1)]);
      path = '';
    }
  });
}


function getValFromPath(p, obj) {
  const path = p.split('.');
  if (path.length === 1) {
    return obj[path[0]];
  }

  const key = path.shift();
  return getValFromPath(path.join('.'), obj[key]);
}

class Validator {
  constructor(o) {
    this.rules = o;
  }

  test(o) {
    let ret = true;
    traverse(this.rules, (val, path) => {
      if (val.test(getValFromPath(path, o), o) === false) {
        ret = false;
      }
    });
    return ret;
  }
}

module.exports = Validator;
