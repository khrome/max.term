![Max.Term](https://raw.githubusercontent.com/khrome/max.term/master/assets/max.loop.gif)

Max.Term
========

`max.term` is a framework for building terminal bots on the commandline using ansi + UTF animation loops, plugged into bot "personalities". You can use it to read RSS feeds to you, amuse and annoy friends as well as script it for your own purposes.

Install
-------

    npm install -g max.term
    max install personality headroom
    max --headroom say "I am installed correctly"

Existing Bots
-------------

- **HAL** : A homicidal ship computer.
- **AnnaK** : Mostly talks about Johnny.
- **Headroom** : A venerable, but glitchy personality who used to be stuck in a TV, but is now stuck in a terminal.

The above bots are made by me and I can vouch for them. You can also [search npm](https://www.npmjs.com/search?q=max.term-*) for bots others have made.

Bot Ideas
-------------
- **Eliza** : The oldest of the personalities
- **Dr.Sedayto** : A bad clone of eliza, not a doctor, but **it** thinks it is.
- **Holly** : A highly unreliable computer
- **Durandal** : A homicidal ship computer
- **VALIS** : An orbital superintelligence that can beam enlightenment to the user.
- **Wintermute** : An AI seeking to better itself.
- **Project2501** : The PuppetMaster is just looking for an AI to settle down with.
- **Heart of Gold** : An exceedingly (exhaustingly) nice ship computer.
- **DaVinci** : A virus targeting energy companies.
- **MCP** :  Cares a whole lot about maintaining the microkernel

Building a Bot
--------------
Put some gifs in directories:
- `/assets/idle/` : put a number of gifs here that will be loaded and cycled through during idle
- `/assets/talking/` : put a number of gifs here that will be loaded and cycled through during talking
- `/assets/emotions/` : put a number of gifs, each named for the emotion it represents

set `options`, `config`, `voice` in it's `package.json`

Roadmap
-------

- make engines pluggable
    - AIML
- support ansi/ascii frames
- support gif/ansi/ascii compositing
- support audio clips for speech
- support speech to text queries
- make query source plugins
- support voice synth plugins
- dialog tree support
- curses-like interaction support
- Desktop apps (just a wrappered terminal for the UI impared)
