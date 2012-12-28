var express = require( 'express' ),
  	http 	= require( 'http' ),
  	sio 	= require( 'socket.io' )
;

/* Init server, express, socket.io
   --------------------------------------------- */
   
var app = express();
var server = http.createServer( app );
var io = sio.listen( server );

app.configure(function() {
	// define public directory
	app.use( express.static( __dirname + '/../public' ) );
	app.use( app.router );
});

// for heroku deployment
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function() {
	io.set('transports', ['xhr-polling']);
	io.set('polling duration', 10);
});

// encapsulate server and socket.io
app.configure(function() {
	app.set( 'io', io );
	app.set( 'server', server );
	app.set( 'SERVER_PORT', process.env.PORT || 5000 );
});

// Error Handling
// to check : http://mikevalstar.com/Blog/105/Coding_with_Nodejs_Part_2_Error_Handling_and_404_pages_with_Express
app.configure( 'development', function() {
	app.use( express.errorHandler({ dumpExceptions : true, showStack : true }) );
}); 

app.configure( 'production', function() {
	app.use( express.errorHandler() );
});

// app now contains server and socket.io
module.exports = app;