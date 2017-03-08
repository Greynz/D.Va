# D.Va Discord Bot

D.Va is a personal Discord bot based on [Discordie] lovingly named after [the Overwatch hero].
It was built for personal use in my Discord server, and comes with no guarantees, however you are free to use, abuse, copy, and reference the code at will with attribution.


### config.js
I pulled some things out into a config so you don't steal my identity.
```javascript
module.exports = {
  token: 'some-really-cool-bot-token',
  packages: ['misc', 'images', 'voice'],
  googleCseId: '12345:abcde',
  googleApiKey: 'asdf-qwerty-asdf',
};
```

### Package Example (packages/misc.js)
I built it with a 'package' structure which allows easy addition of new commands.
Here is a simplified version of one of the included packages:
```javascript
'use strict';
module.exports = {
    name: 'Misc',
    commands: [
        {
            alias: ['status', 'game'],
            params: 'status',
            help: 'Set the bot\'s status message',
            action: (bot, msg, params) => {
                const game = params.length ? params.join(' ') : '';
                bot.User.setStatus('online', {name: game});
            }
        },
    ]
};
```

### Help
Using the package structure will automatically built a !help option. The above package would build the following:
```
Available Commands:

MISC
!status, !game    Params: status    Set the bot's status message
```

### Voice
Voice requires ffmpeg in your path and has only been tested on Ubuntu 14.04.
The built in play function will first attempt to play as a YouTube link (with support for linking at certain times), and then will attempt to use ffmpeg to play it. It has only been tested with links to .mp3, .wav, .webm, and .ogg.

The built in sfx function will work with any .mp3 file in the sfx/ folder

The built in dva function will a random file from the dvasfx/ folder. I found my D.Va sound effects [here].

The built in wow function will play a random wow npc sound. It can be filtered in the form of `!wow race gender`

All of the voice commands support adjustment of pitch (0.5 - 1.5) and tempo (any number) like so:
`!p https://www.youtube.com/watch?v=zoi5kc8NCsM&feature=youtu.be&t=15 1.25 0.75`


### License
MIT License

Copyright (c) 2016 Rob Pohlman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

   [Discordie]: <https://github.com/qeled/discordie>
   [the Overwatch hero]: <https://playoverwatch.com/en-us/heroes/dva/>
   [here]: <https://www.reddit.com/r/Overwatch/comments/47zlhi/sound_files_organized_sort_of_come_get_some/>
