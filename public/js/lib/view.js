var View = (function( window, document, $, _, Canvas, undefined) {

	function View( templates ) {
		// config
		_.templateSettings.variable = 'rsc';
		
		this.container = $( '#wrapper' );
		this._templates = templates;
		
		this.loader;
		this.dialog;
		this.playerLabels = [];
		this.canvas = {};
	};

	// _.template wrapper
	// return : jQuery object of rendered template
	View.prototype.display = function( tmplId, data, empty, container ) {
		var container = container || this.container,
			tmpl = _.template( this._templates[ tmplId ] ),
			html;
		
		if ( empty ) {
			container.empty();
		}
		
		html = $( tmpl( data ) );
		container.append( html );
		
		return html;
	};
	
	View.prototype.personalize = function( elm, team, size ) {
		// size : 80 for users - 70 for dialogs
		var canvas = new Canvas( false, size ); 
		elm.prepend( canvas._elm );
		canvas.draw( team );
	};
	
	View.prototype.freeze = function() {
		this.toggleCanvas( true );
	};
	View.prototype.unfreeze = function() {
		this.toggleCanvas( false );
	};
	
	View.prototype.toggleCanvas = function( lock ) {
		for ( var i in this.canvas ) {
			this.canvas[i].isLocked = lock;
		}
	};
	
	/** 
	 *	use : 
	 *		var loader = myView.initLoader( $( '#loader' ) );
	 *		... loader.stop();
	 **/
	View.prototype.initLoader = function( elm ) {
		var timeoutId, count = 0,
			blocks = elm.children();
			
		(function anim() {
			var lastIndex = (count - 1) % 6,
				index = count % 6;
			
			blocks.eq( lastIndex ).fadeTo( 1500, 0 );
			blocks.eq( index ).fadeTo( 2000, 1 );
			
			timeoutId = setTimeout( function() {
				count++; 
				anim();
			}, 1000 );
		}());
		
		return {
			stop : function() {
				clearTimeout( timeoutId );
			}
		};
	};
	
	View.prototype.addPlayground = function( mask ) {
		var size = 120,
			mask = mask,
			container = mask.find( '#playground' ),
			canvasCollection = {};
	
		mask.width( 3 * size );
		mask.height( 3 * size );
		container.css({
			width : ( 3 * size + 2*3),
			height : ( 3 * size + 2*3),
			bottom : '2px',
			right : '2px'
		});
		
		for ( var i = 0; i < 9; i++ ) {
			var canvas = new Canvas( i, size );
			canvas._elm.classList.add( 'box' );
			canvasCollection[ canvas._id ] = canvas;
			container.append( canvas._elm );
			this.canvas[i] = canvas;
		}
	};
	
	View.prototype.animatePath = function( path ) {
		var that = this,
			selector = $( _.map( path, function( num ){
				return '#canvas_' + num;
			}).join( ',' ) )
		;
		
		// do some little animation here
		(function anim( count ) {
			selector.fadeTo( 400, count % 2, function() {
				that.animationTimeout = setTimeout( function() {
					anim( ++count, path );
				}, 100 );
			});			
		}( 0 ));
	};
	
	View.prototype.createGame = function( data ) {
		// stop loader
		this.container.empty();
		clearTimeout( this.animationTimeout );
		var playersContainer = $( '<div id="players"></div>' ).appendTo( this.container );
		
		for ( var player in data ) {
			var playerLabel = this.display( 'player', data[ player ], false, playersContainer );
			playerLabel.addClass( data[ player].team );
			this.personalize( playerLabel, data[ player].team, 80 );

			this.playerLabels.push( playerLabel[0] );
		};
		
		var playgroundContainer = this.display( 'playground', {}, false );
		this.addPlayground( playgroundContainer );
	};
	
	View.prototype.togglePlayer = function( team ) {		
		_.each( this.playerLabels, function( elm ) {
			elm.classList.remove( 'active' );
			if ( team && elm.classList.contains( team ) ) {
				elm.classList.add( 'active' );
			}
		});	
	};
	
	View.prototype.updateScore = function( playerId, score ) {
		$( '#' + playerId ).find( '.score' ).text( score );
	};
	
	return View;
	
}( window, document, jQuery, _, Canvas ));