![Max.Term](./assets/max.loop.gif)
Max.Term
========

`max.term` is a framework for building terminal bots on the commandline using ansi + UTF animation loops, plugged into bot "personalities". You can use it to read RSS feeds to you, amuse and annoy friends as well as script it for your own purposes.

Install
-------

    npm install -g max.term
    max install headroom
    max --headroom say "I am installed correctly"

Existing Bots
-------------

- **HAL** : A homicidal ship computer.
- **AnnaK** : Mostly talks about Johnny.
- **Headroom** : A venerable, but glitchy personality who used to be stuck in a TV, but is now stuck in a terminal.

Bot Ideas
-------------
- **Eliza** : The oldest of the personalities
- **Dr.Sedayto** : A bad clone of eliza, not a doctor, but **it** thinks it is.
- **Holly** : A highly unreliable computer
- **Durandal** : A homicidal ship computer
- **VALIS** : An orbital superintelligence that can beam enlightenment to the user.
- **Wintermute** : An AI seeking to better itself
- **Gibson** : Hacks things, makes threats.
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
