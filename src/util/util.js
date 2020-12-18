const toString = Object.prototype.toString;

const toType = function (target) {
  let str = toString.call(target);
  return str.slice(8, str.length-1);
}

const deepClone = function (target) {
  let type = toType(target);
  let res = null;
  if (type === 'Array') {
    res = [];
    target.forEach((item, i) => {
      res[i] = deepClone(item);
    })
  } else if (type === 'Object') {
    res = {};
    Object.keys(target).forEach(key => {
      res[key] = deepClone(target[key]);
    })
  } else {
    res = target;
  }
  return res;
}

export {
  toType,
  deepClone,
}