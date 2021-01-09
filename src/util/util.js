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

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const parsetimeData = function (time) {
  const days = Math.floor(time / DAY);
  const hours = Math.floor((time % DAY) / HOUR);
  const minutes = Math.floor((time % HOUR) / MINUTE);
  const seconds = Math.floor((time % MINUTE) / SECOND);

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

const parseFormat = function (format = 'DD:HH:mm', timeData) {
  let { days, hours, minutes, seconds } = timeData;
  if (format.indexOf('DD') === -1) {
    hours += days * 24;
  } else {
    format = format.replace('DD', padZero(days));
  }
  format = format.replace('HH', padZero(hours));
  format = format.replace('mm', padZero(minutes));
  format = format.replace('ss', padZero(seconds));
  return format;
}

const parseSecondTime = function (timeData) {
  let { days, hours, minutes, seconds } = timeData;
  let s = 0;
  s += parseInt(seconds);
  s += parseInt(60 * minutes);
  s += parseInt(3600 * hours);
  s += parseInt(24 * 3600 * days);
  return s;
}

const padZero = function (num) {
  let str = '' + num;
  if (str.length < 2) {
    str = 0 + str;
  }
  return str;
}

export {
  toType,
  deepClone,
  formatTime,
  parsetimeData,
  parseFormat,
  parseSecondTime,
}