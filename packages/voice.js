'use strict';
const fs= require('fs');
const ytdl = require('ytdl-core');
const execSync = require('child_process').execSync;


let voiceConnection = false;
let encoder = false;
let volume = 1.0;
const DVA_SFX = fs.readdirSync('dvasfx/');


module.exports = {
    name: 'Voice',
    commands: [

        // Join
        {
            alias:['join', 'vjoin'],
            help:'Join your voice channel',
            action: (bot, msg, params) => {
                const authorChannel = msg.author.getVoiceChannel(msg.guild);
                if (!authorChannel) {
                  msg.reply("You're not in a voice channel.");
                } else {
                  authorChannel.join().then((info) => {
                    voiceConnection = info.voiceConnection;
                  }).catch((err) => {msg.reply(err);});
                }
            }
        },

        // leave
        {
            alias:['leave', 'vleave'],
            help:'Leave the voice channel',
            action: (bot, msg, params) => {
              bot.Dispatcher.removeAllListeners('VOICE_CHANNEL_JOIN');
              if (voiceConnection) {
                voiceConnection.disconnect();
                voiceConnection = false;
              }
            }
        },

        // Play Sound
        {
            alias:['play', 'vplay', 'p'],
            params:'url',
            help:'Play a YouTube url or a url that contains an audio file.',
            action: (bot, msg, params) => {
                if (!voiceConnection) msg.reply("I'm not in a voice channel, use !join first.");

                else if (params.length > 0) {
                  try {
                    ytdl.getInfo(params[0], (err, mediaInfo) => {
                      if (err) {

                      }
                      else {
                        var formats = mediaInfo.formats.filter(f => f.container === "webm").sort((a, b) => b.audioBitrate - a.audioBitrate);
                        var bestaudio = formats.find(f => f.audioBitrate > 0 && !f.bitrate) || formats.find(f => f.audioBitrate > 0);
                        if (!bestaudio) msg.reply("No valid formats");
                        else {
                          encoder = voiceConnection.createExternalEncoder({
                            type: "ffmpeg",
                            source: bestaudio.url,
                            outputArgs: ["-af", 'volume=' + volume]
                          });
                          encoder.play();
                        }
                      }
                    });
                  } catch (e) {
                    // Not a youtube url, try playing it with ffmpeg
                    encoder = voiceConnection.createExternalEncoder({
                      type: "ffmpeg",
                      source: params[0],
                      outputArgs: ["-af", 'volume=' + volume]
                    });
                    encoder.play();
                  }
                }
                else msg.reply("Pass a URL to play.");
            }
        },

        // Stop
        {
            alias:['stop', 's', 'vstop'],
            help:'Stop playing',
            action: (bot, msg, params) => {
              if (encoder) {
                encoder.stop();
                encoder = false;
              }
            }
        },

        // Volume
        {
            alias:['v', 'vol', 'volume'],
            params:'volume, 1-100',
            help:'Set voice volume',
            action: (bot, msg, params) => {
                if (params.length < 1) msg.reply('Pass a volume between 1 and 100.');
                else {
                  const num = parseInt(params[0]);
                  if (isNaN(num) || num < 1 || num > 100) msg.reply('Pass a volume between 1 and 100.');
                  else {
                    volume = num / 100 * 1;
                    msg.channel.sendMessage('Volume set to: *' + num + '*.');
                  }
                }
            }
        },

        // D.Va sfx
        {
            alias:['dva', 'd.va', 'talk'],
            help:'Play a random D.Va sound effect',
            action: (bot, msg, params) => {
                if (!voiceConnection) {
                    msg.reply("I'm not in a voice channel, use !join first.");
                } else {
                  const dvaSound = DVA_SFX[Math.floor(Math.random() * DVA_SFX.length)];
                  encoder = voiceConnection.createExternalEncoder({
                    type: "ffmpeg",
                    source: 'dvasfx/' + dvaSound,
                    outputArgs: ["-af", 'volume=' + volume],
                  });
                  encoder.play();
                }
            }
        },

        // SFX
        {
            alias:['sfx', 'file', 'audio'],
            params:'filename',
            help:'Try to play a file with the supplied filename',
            action: (bot, msg, params) => {
                if (params.length < 1) {
                    msg.reply('Please pass a filename');
                } else if (!voiceConnection) {
                    msg.reply("I'm not in a voice channel, use !join first.");
                } else {
                  encoder = voiceConnection.createExternalEncoder({
                    type: "ffmpeg",
                    source: 'sfx/' + params[0] + '.mp3',
                    outputArgs: ["-af", 'volume=' + volume],
                  });
                  encoder.play();
                }
            }
        },

        // SFX list
        {
            alias:['sfxlist', 'audiolist'],
            help:'List files in sfx directory',
            action: (bot, msg, params) => {
                let res = 'Sfx options: ';
                const files = fs.readdirSync('sfx/');
                for (let i=0;i<files.length;i++) {
                    files[i] = files[i].substring(0, files[i].length - 4);
                }
                res += files.join(', ');
                msg.reply(res);
            }
        },

    ]
};
