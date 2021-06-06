var eachOfLimit = require('async/eachOfLimit');
var Gif = require('ansi-gif');
var fs = require('fs');
var Gauge = require("gauge");
var path = require('path');
var audio = require('./max-audio');

var speak = function(str, voice, cb){
    audio.say(str, {voice:voice}, cb);
}

var pluginName = function(type, name){
    switch(type){
        case 'engine' : return 'max.term.engine-'+name;
        case 'plugin' : return 'max.term.plugin-'+name;
        case 'personality' : return 'max.term-'+name;
        default : throw new Error('Unknown type:'+type);
    }
}
//return;
var gauge
var max = function(opts){
    this.options = opts || {};
    this.jobs = [];
    var ob = this;
    gauge = new Gauge()
    gauge.show('Loading... ', 0.1)
    var root = this.options.modulesDir || './assets/';
    this.moduleRoot = root;
    if(this.options.personality){
        var plugName = pluginName('personality', this.options.personality);
        //todo: ensure personality string is clean
        //todo: support external personalities
        fs.stat(path.join(root, plugName), function(err, stat){
            if(stat && !err){
                ob.loadAssets(ob.options.personality, function(type, name){
                    return opts.plugin?opts.plugin(type, name):require(name);
                }, function(){
                    gauge.hide();
                    var fns = ob.jobs;
                    ob.jobs = [];
                    ob.ready = function(fn){ setTimeout(fn, 0) };
                    fns.forEach(function(f){ f() });
                }, function(current, total){
                    gauge.show('Loading ('+current+'/'+total+') Frames', current/total)
                })
            }else{
                //nothing really to do, mb output a warning
            }
        });
    }
}

max.prototype.ready = function(fn){
    this.jobs.push(fn);
}

var pos = 0;

max.prototype.start = function(mood){
    if(this.currentAction) this.currentAction.stop();
    var lmood;
    var ob = this;
    var thisPos;
    switch(lmood = (mood||'').toLowerCase()){
        case 'idle':
        case 'none':
        case '':
        case null:
            thisPos = pos%this.idle.length
            this.currentAction = this.idle[thisPos];
            break;
        case 'talking':
            thisPos = pos%this.talking.length
            this.currentAction = this.talking[thisPos];
            break;
        default:
            this.currentAction = this.emotions[lmood];
            break;
    }
    pos++;
    if(!this.currentAction) throw new Error('Unknown Mood: '+mood);
    this.currentAction.play({doNotLoop:true, callback: function(erase){
        setTimeout(function(){
            if(erase) erase();
            ob.start(mood);
        }, 0);
    }});
}

max.prototype.stop = function(){
    if(this.currentAction){
        this.currentAction.stop();
        this.currentAction = null;
    }
}

max.prototype.loadAssets = function(personality, getPlugin, callback, updateHandler){
    var saw = {};
    //todo: test local
    var plugName = pluginName('personality', personality);
    var ppath = path.join(this.moduleRoot, plugName, 'package')
    var config = require(ppath);
    this.pConfig = config;
    var locations = {
        idle : config.personality.idle || 'idle',
        emotions : config.personality.emotions || 'emotions',
        talking : config.personality.talking || 'talking'
    }
    var lastTotal = 0;
    var lastCurrent = 0;
    var totals = [];
    var currents = [];
    var ob = this;
    var PersonalityType = getPlugin('engine', config.personality.engine);
    this.personality = new PersonalityType(config.personality.options||{});
    var modPath = path.join(ob.moduleRoot, plugName)
    eachOfLimit([
        'idle',
        'emotions',
        'talking'
    ], 1, function(name, index, done){
        if(!locations[name]) throw new Error('Unknown location: '+name)

        fs.readdir(path.join(modPath, 'assets', locations[name]), function(err, contents){
            if(err) return callback(err);
            eachOfLimit(contents, 1, function(img, idx, imgDone){
                var loc = path.join(modPath, 'assets', locations[name], img);
                var gifOpts = (config.personality.config && {
                    'alphabet' : config.personality.config.alphabet,
                    'width' : config.personality.config.width,
                    'verb' : config.personality.config.verb,
                    'color' : config.personality.config.color,
                    'threshold' : config.personality.config.threshold,
                    'stipple' : config.personality.config.stipple,
                    'background' : config.personality.config.background,
                    'blended' : config.personality.config.blended,
                    'colorMatching' : config.personality.config.colorMatching,
                    '4bit' : config.personality.config.bits === 4,
                    '8bit' : config.personality.config.bits === 8,
                    '32bit' : config.personality.config.bits === 32,
                    'file' : loc
                }) || { 'file' : loc };
                var gif = new Gif(gifOpts);
                gif.load(function(current, total){
                    totals[index] = total;
                    currents[index] = total;
                    var total = totals.reduce((a, i)=>{return a + i}, 0);
                    var current = currents.reduce((a, i)=>{return a + i}, 0);
                    updateHandler(lastCurrent+current, lastTotal+total);
                }, function(){
                    if(name === 'emotions'){
                        if(!ob[name]) ob[name] = {};
                        var emotion = img.split('.').shift();
                        ob[name][emotion] = gif;
                    }else{
                        if(!ob[name]) ob[name] = [];
                        ob[name].push(gif);
                    }
                    imgDone();
                });
            }, function(){
                lastCurrent += currents.reduce((a, i)=>{return a + i}, 0);
                lastTotal += totals.reduce((a, i)=>{return a + i}, 0);
                done();
            });
        });
    }, function(){
        callback();
    });
}

max.prototype.output = function(stream){

}

max.prototype.say = function(str, cb){
    var ob = this;
    this.ready(function(){
        if(typeof str === 'string'){
            ob.start('talking');
            speak(str, ob.pConfig.personality.voice, function(err){
                ob.stop();
                cb();
            });
        }
    });
}

max.prototype.input = function(str, cb){
    var ob = this;
    this.ready(function(){
        ob.start();
        if(typeof str === 'string'){
            ob.personality.input(str, function(err, reply){
                if(reply && reply.assembled && reply.assembled.reassembled){
                    ob.start('talking');
                    speak(reply.assembled.reassembled, ob.pConfig.personality.voice, function(err){
                        if(err) throw err;
                        ob.stop();
                        cb();
                    });
                }
            });
        }
    });
}


module.exports = max;
