function createIntroductor(lib){
  'use strict';
  var __introducees = new lib.Map();
  function IntroductionStrategy(){
  }
  IntroductionStrategy.prototype.destroy = lib.dummyFunc;
  IntroductionStrategy.prototype.check = function(credentials){
    return __introducees.remove(credentials);
  };
  IntroductionStrategy.introduce = function(userprophash,uid){
    var _uid = uid||lib.uid();
    __introducees.replace(_uid,userprophash);
    return _uid;
  };
  IntroductionStrategy.forget = function(sessionid) {
    return __introducees.remove(sessionid);
  };
  return IntroductionStrategy;
}

module.exports = createIntroductor;
