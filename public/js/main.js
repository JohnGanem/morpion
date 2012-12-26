var Morpion = (function( window, document, $, io, View, _templates, undefined ) {

	function Morpion( config ) {
		this._config = config;
		this._view = new View( _templates );
		this._socket = io.connect( this._config.url, this._config.option );

		this._player = {};
		this.enemy = {};
		this._playedBox;
		
		// bind socket routes
		this.listenSocket();
		// bind event Listeners
		this.listenEvents();
	};
	
	Morpion.prototype.listenSocket = function() {
		var that = this;
		
		// login
		this._socket.on( 'choose.name', function() {
			that._view.display( 'login', {
				field : 'Please enter your name',
			}, true );
		});
		
		this._socket.on( 'name.used', function() {
			delete that._player.name;

			that._view.display( 'login', {
				sorry : 'Sorry this name is already used',
				field : 'Please enter another name'
			}, true );
		});
		
		// loading
		this._socket.on( 'game.waiting', function() {
			that._view.display( 'loader', {
				name : that._player.name,
				text : 'Waiting for another player...'
			}, true );
			that._view.loader = that._view.initLoader( $( '#loader' ) );
		});
		
		this._socket.on( 'game.full', function() {
			that._view.display( 'loader', {
				name : that._player.name,
				text : 'Sorry the game is currently full...'
			}, true );
			that._view.loader = that._view.initLoader( $( '#loader' ) );
		});
		
		// game
		this._socket.on( 'game.launch', function( data ) {
			if ( that._view.loader ) {
				that._view.loader.stop();
			}
			
			that._view.createGame( data.players );
			that._view.togglePlayer( data.begins );
			console.log( data.players );
			
			that._view.dialog = that._view.display( 'dialog', {
				text : 'begins'	
			}, false );
			that._view.personalize( that._view.dialog, data.begins, 70 );
			
			// setPLayers
			for ( var i in data.players ) {
				data.players[i].isPlaying = ( data.begins === data.players[i].team );
			
				if ( that._player.name === data.players[i].name ) {
					that._player = data.players[i];
				} else {
					that.enemy = data.players[i];
				}
			}
			
			setTimeout( function() {
				that._view.dialog.fadeTo( 300, 0, function() {
					that._view.dialog.remove();
					// prevent drawing before beginning
					that._view.unfreeze();
				});
			}, 3000 );
		});
		
		this._socket.on( 'winner.is', function( data ) {
			that._view.freeze();
			that._view.dialog = that._view.display( 'dialog', {
				text : 'wins !',
				button : {
					label : 'Replay',
					id : 'btn-replay'
				}
			}, false );
			that._view.personalize( that._view.dialog, data.team, 70 );
			that._view.togglePlayer( false );
			that._view.animatePath( data.scheme );
			that._view.updateScore( data.player, data.score );
		});
		
		this._socket.on( 'ex.aequo', function() {
			that._view.display( 'dialog', {
				text : 'ex-aequo',
				classTxt : 'center',
				button : {
					label : 'Replay',
					id : 'btn-replay'
				}
			}, false );
		});
		
		this._socket.on( 'game.abort', function( data ) {
			that._view.dialog = that._view.display( 'dialog', {
				text : 'has run away !',
				button : {
					label : 'find another player',
					id : 'btn-find'
				} 
			}, false );
			that._view.personalize( that._view.dialog, data.team, 70 );
		});
		
		// deal boxclick
		this._socket.on( 'deal.refused', function() {
			console.log( 'deal refused' );
		});
		
		this._socket.on( 'deal.accepted', function( data ) {
			that._view.canvas[ data.box ].draw( that._player.team );
			that.togglePlayers();
		});
		
		this._socket.on( 'enemy.play', function( data ) {
			that._view.canvas[ data.box ].draw( that.enemy.team );
			that.togglePlayers();
		});
	};
	
	Morpion.prototype.togglePlayers = function() {
		this._player.isPlaying = !this._player.isPlaying;
		this.enemy.isPlaying = !this.enemy.isPlaying;

		var toPlay = this._player.isPlaying ? this._player.team : this.enemy.team;
		this._view.togglePlayer( toPlay );
	}
	
	Morpion.prototype.listenEvents = function() {
		// use this._view.container
		var that = this,
			container = this._view.container;
		
		container.on( 'focus', 'input[type=text]', function() {
			this.value = '';
		});
		
		container.on( 'submit', '#submit-name', function( e ) {
			e.preventDefault();
			that._player.name = $.trim( $( '#field-name' )[0].value );
			
			if ( that._player.name === '' ) {
				delete that._player.name;
				return;
			}
 
			that._socket.emit( 'user.name', { 
				name : that._player.name
			});
		});
		
		container.on( 'click', '#btn-replay', function() {
			that._socket.emit( 'game.replay' );
		});
		
		container.on( 'click', '#btn-find', function() {
			that._socket.emit( 'find.player' );
		});
		
		// canvas's listerners...
		container.on( 'click', '.box', function() {
			var boxId = parseInt( $( this ).attr( 'data-id' ) );
			
			if ( !that._view.canvas[ boxId ].isLocked ) {
				that._socket.emit( 'box.checked', {
					player : that._player.id,
					box : boxId
				});
			}
		});
		
	};
	
	Morpion.prototype.run = function() {
		this._socket.emit( 'hello' );
	}
	
	return Morpion;
	
}( window, document, jQuery, io, View, _templates ));

$( document ).ready( function() {
	// new App();
	var app = new Morpion({
		url : window.location.hostname,
		option : {'sync disconnect on unload' : true} 
	});
	app.run();
});