const toString = Object.prototype.toString;

const toType = function (target) {
  let str = toString.call(target);
  return str.slice(8, str.length-1);
}

const fullZero = function (num) {
  num = num.toString();
  if (num.length < 2) {
    num = 0 + num;
  }
  return num;
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

const formatTime = function (time) {
  let str = '';
  if (toType(time) === 'Number' || toType(time) === 'String') {
    time = new Date(time);
  }
  if (toType(time) === 'Date') {
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    str = `${year}-${fullZero(month)}-${fullZero(date)}`
  }
  return str;
}

export {
  toType,
  deepClone,
  formatTime,
}