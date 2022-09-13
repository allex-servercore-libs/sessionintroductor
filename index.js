function createIntroductor(lib){
  'use strict';
  var __introducees = new lib.Map();

  var MAXLIFETIME = 10 * lib.intervals.Minute;
  var __scheduled = false;


  function expirer (now, exp, item, id) {
    if (!item) {
      exp.push(id);
      return;
    }
    if (!item.ph) {
      exp.push(id);
      return;
    }
    if (now - item.created > MAXLIFETIME) {
      exp.push(id);
      return;
    }
  }
  function remover (id) {
    __introducees.remove(id);
  }
  function cleanExpired () {
    var expired = [], _exp = expired, now = Date.now();
    __introducees.traverse(expirer.bind(null, now, _exp));
    _exp = null;
    expired.forEach(remover);
    now = null;
    __scheduled = false;
  }
  function doCleaning () {
    if (__scheduled) {
      return;
    }
    __scheduled = true;
    lib.runNext(cleanExpired);
  }

  function IntroductionStrategy(){
  }
  IntroductionStrategy.prototype.destroy = lib.dummyFunc;
  IntroductionStrategy.prototype.check = function(credentials, bla){
    var item = __introducees.remove(credentials);
    doCleaning();
    return item ? item.ph : null;
  };
  IntroductionStrategy.introduce = function(userprophash,uid){
    var _uid = uid||lib.uid();
    __introducees.replace(_uid,{
      created: Date.now(),
      ph: userprophash
    });
    doCleaning();
    return _uid;
  };
  IntroductionStrategy.forget = function(sessionid) {
    doCleaning();
    return __introducees.remove(sessionid);
  };
  return IntroductionStrategy;
}

module.exports = createIntroductor;
