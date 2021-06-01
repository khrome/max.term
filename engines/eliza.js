var eliza = require('eliza-core');
var util = require('eliza-util');


var Eliza = function(){
    this.jobs = [];
    var ob = this;
    eliza.loadEliza(util.fromFile(util.SCRIPT_PATH + '/eliza.script')).then((elz) => {
      ob.eliza = elz;
      var fns = ob.jobs;
      ob.jobs = [];
      ob.ready = function(fn){ setTimeout(fn, 0) };
      fns.forEach(function(f){ f() });
    });
}

Eliza.prototype.ready = function(fn){
    this.jobs.push(fn);
}

Eliza.prototype.input = function(str, cb){
    var ob = this;
    setTimeout(function(){
        cb(null, ob.eliza.processInput(str));
    }, 0)
}

module.exports = Eliza;
