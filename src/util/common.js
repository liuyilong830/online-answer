export const TemplateTimu = function (
  desc = '',
  options = [],
  res = [],
  youres = [],
  tid = 1,
  finished = false,
  quesid = 1,
  tname = '',
  tnum = 0
) {
  this.description = desc;
  this.options = options;
  this.res = res;
  this.youres = youres;
  this.tid = tid;
  this.tname = tname;
  this.finished = finished;
  this.quesid = quesid;
  this.tnum = tnum;
}