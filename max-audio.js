var fs = require('fs');
var text2wav = require('text2wav');
var portAudio = require('naudiodon');
portAudio.setConsole({log : function(){}, error:function(){}});
var SB = require('stream-buffers');

var outputChannels = portAudio.getDevices().filter(function(device){
    return !!device.maxOutputChannels;
});
var audioAPIs = portAudio.getHostAPIs();

var outputChannels = portAudio.getDevices().filter(function(device){
    return !!device.maxOutputChannels;
})

/*
console.log(outputChannels);

console.log(audioAPIs);
//*/

var queue = [];
var isPlaying = false;
var buffer2stream = function(buff){
    var stream = new SB.ReadableStreamBuffer({});
    stream.put(buff);
    stream.stop();
    /*stream.on('error', function(err){
        console.log('ERR', err);
    });*/
    return stream;
}
var audio = {
    play : function(sound, cb){//sound is a stream, buffer or filename
        var aio = new portAudio.AudioIO({
          outOptions: {
            channelCount: 2,
            sampleFormat: portAudio.SampleFormat16Bit,
            sampleRate: 12000,
            deviceId: -1, // default
            closeOnError: false //tolerate slow streams
          }
        });
        var stream = sound;
        if(sound.constructor === Uint8Array){
            stream = buffer2stream(Buffer.from(sound));
        }
        if(typeof sound === 'string'){
            stream = fs.readableStream(sound);
        }
        if(sound instanceof Buffer){
            stream = buffer2stream(sound);
        }
        isPlaying = true;
        stream.on('end', function(){
            setTimeout(function(){
                aio.quit();
                setTimeout(function(){ cb() }, 0);
            }, 1000);
        });
        stream.pipe(aio);
        aio.start(); //*/
    },
    say : function(str, opts, cb){
        text2wav(str, {
            voice : opts.voice || 'en-us'
        }).then(function(out){
            audio.play(out, function(){
                cb();
            });
        }).catch(function(err){
            cb(err);
        })
    }
}


module.exports = audio;
