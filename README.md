MORPION
=======

a "Tic, Tac, Toe" game using node.js
------------------------------------

http://sleepy-anchorage-1790.herokuapp.com/


FIXME
-----

```javascript
socket.on( 'disconnect', function() {
	// doStuff;
});
```
doesn't seem to be triggered all the time or with a delay
- maybe due to the XHRPooling ?


TODO LIST
---------

Allow multiple instances of game at the same time
(only 2 players at the same time for now)

Adding a hight score view on login view :
- require mongodb
- mongodb require brew
- brew require Xcode
- free Xcode require an updated version of osX (currently 10.6.8 snow Leopard)
- finally, have something to pay to Apple... not during Xmas...

(http://stackoverflow.com/questions/9765561/how-to-xcode-4-in-osx-10-6-8)


Notes
-----

http://robdodson.me/blog/2012/06/04/deploying-your-first-node-dot-js-and-socket-dot-io-app-to-heroku/
http://stackoverflow.com/questions/12043893/socket-io-force-a-disconnect-over-xhr-polling

