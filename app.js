var app = require( './lib/bootstrap' ),
  	game = require( './lib/game' ),	// game.js exports a single instance of Game
  	User = require( './lib/user' )
;

// one file app - ..short routing
app.get( '/', function( req, res, next ) {
	res.sendfile( 'index.html' );
	next();
});

// init sockets
// 		note : to emit to all clients : io.sockets.emit();
var io = app.get( 'io' ),
	users = {};

io.sockets.on( 'connection', function( socket ) {

	// create a socket Manager
	socket.on( 'hello', function() {
		socket.emit( 'choose.name' );
	});
	
	socket.on( 'user.name', function( data ) {
		// if name already exists
		for ( var i in users ) {
			if ( users[i]._name === data.name ) {
				return socket.emit( 'name.used' );
			}
		}
		
		var user = new User( socket, data.name );
		users[socket.id] = user;
		
		// check game state
		switch ( game.setPlayer( user ) ) {
			case 1 :
				socket.emit( 'game.waiting' );
			break;
			case 2 :
				game.launch();
			break;
			case false :
				socket.emit( 'game.full' );
			break;
		
		}
	});
	// */
	socket.on( 'game.replay', function() {
		game.launch();
	});
	
	socket.on( 'find.player', function() {
		for( var i in users ) {
			if ( users[ i ].isInGame === false ) {
				game.setPlayer( users[ i ] );
				game.launch();
				// console.log( users[ i ] );
				break;
			} else {
				socket.emit( 'game.waiting' );
			}
		}
	});
	
	socket.on( 'box.checked', function( data ) {
		// console.log( data );
		game.deal( data );
	});
	
	socket.on( 'disconnect', function() {
		if ( users[ socket.id ] ) {
			game.deletePlayer( socket.id );
			delete users[ socket.id ];
		}
	});
});

app.get( 'server' ).listen( app.get( 'SERVER_PORT' ), function(){
	console.log( 'info: server is running on port : %s', app.get( 'SERVER_PORT' ) );
});

