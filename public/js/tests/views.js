$( document ).ready( function() {
	// config
	_.templateSettings.variable = 'rsc';
	var content = $( '#wrapper' );
	
	// TODO - logo
	// ajouter des canvas dans le header

	// -----------------------------------------
	function display( tmplId, data, empty, container ) {
		var container = container || content,
			tmpl = _.template( _templates[ tmplId ] ),
			html;
		
		if ( empty ) {
			// container.fadeOut( 1000 );
			container.empty();
		}
		html = $( tmpl( data ) );
		container.append( html );

		return html;
	}
	
	function load() {
		var timeoutId, count = 0,
			blocks = $( '#loader' ).children();
			
		function anim() {
			var lastIndex = (count - 1) % 6,
				index = count % 6;
			
			blocks.eq( lastIndex ).fadeTo( 1500, 0 );
			blocks.eq( index ).fadeTo( 2000, 1 );
			
			timeoutId = setTimeout( function() {
				count++; 
				anim();
			}, 1000 );
		}
		anim();
		
		return {
			stop : function() {
				clearTimeout( timeoutId );
			}
		};
	}
	
	function addPlayground() {
		var size = 120,
			mask = $( '#mask' );
			container = $( '#playground' ),
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
			canvasCollection[ canvas._id ] = canvas;
			container.append( canvas._elm );
		}
		
		var teams = [ 'cross', 'circle' ];
		var toPlay = true;

		container.on( 'click', 'canvas', function() {
			var id = parseInt( $( this ).attr( 'data-id' ) );
			canvasCollection[ id ].draw( teams[ + toPlay ] );
			toPlay = !toPlay;
		});
	}
	
	// data
	// ----------------------------------------------
	var contentTxt = {
		login1 : {
			field : 'Please enter your name',
			sorry : false
		},
		login2 : {
			sorry : 'Sorry this name is already used',
			field : 'Try again...'
		},
		waiting : {
			// from socket
			name : 'TestName',
			text : 'Waiting for another player...'
		},
		full : {
			name : 'TestName',
			text : 'Sorry the game is full...'
		}
	};
	
	var playersInfos = {
		player1 : {
			id : 'jkqQERGnc4QER',
			name : 'Player 1',
			team : 'cross',
			score : 0
		},
		player2 : {
			id : 'jQopvn75nz',
			name : 'Player 2',
			team : 'circle',
			score : 1
		}
	};
	
	var dialogTxt = {
		begins : {
			team : 'circle', // from socket - ok
			text : 'begins'
		},
		winner : {
			team : 'cross', // from socket
			text : 'is the winner',
			button : 'Replay'
		},
		exequo : {
			text : 'Ex equo',
			classTxt : 'center',
			button : 'Replay'
		},
		abort : {
			team : 'circle', // from socket
			text : 'ran away',
			button : 'Find a new enemy !'
		}
	}
	
	// tests 
	// ----------------------------------------------
	var loader, dialog;
	$( '#wrapper' ).on( 'click', '.btn', function() {
		// loader.stop();
	});
	
	function testTmpl( index, anim ) {
		var time = 3000;
		switch( index ) {
			case 1 :
				display( 'login', contentTxt['login1'], true );
			break;
			case 2 :
				display( 'login', contentTxt['login2'], true );
			break;
			case 3 :
				display( 'loader', contentTxt['waiting'], true );
				loader = load();
				
				time = 6000;
			break;
			case 4 :
				if ( loader ) { loader.stop(); }

				display( 'loader', contentTxt['full'], true );
				loader = load();
				
				time = 6000;
			break;
			case 5 :
				// stop loader
				if ( loader ) { loader.stop(); }
				
				content.empty();
				
				var playersContainer = $( '<div id="players"></div' ).appendTo( content );
				var flag = true;
				
				for ( var i in playersInfos ) {
					// with 100 => need to be pick from screen size
					var canvas = new Canvas( false, 80 );
				
					var playerView = display( 'player', playersInfos[i], false, playersContainer );
					playerView.prepend( canvas._elm );
					canvas.draw( playersInfos[i].team );
					
					if ( flag ) {
						playerView.addClass( 'active' );
					}
					console.log( flag );
					flag = !flag;
				};
				
				display( 'playground', {}, false );
				addPlayground();
				
				var canvas = new Canvas( false, 70 );
				
				dialog = display( 'dialog', dialogTxt['begins'], false );
				dialog.prepend( canvas._elm );
				canvas.draw( dialogTxt['begins']['team'] );
			break;
			case 6 : 
				dialog.fadeTo( 300, 0, function() {
					dialog.remove();
				});
			break;
			case 7 :
				var canvas = new Canvas( false, 70 );
				
				dialog = display( 'dialog', dialogTxt['winner'], false );
				dialog.prepend( canvas._elm );
				canvas.draw( dialogTxt['winner']['team'] );
			break;
			case 8 : 
				dialog.fadeTo( 300, 0, function() {
					dialog.remove();
				});
			break;
			case 9 :
				dialog = display( 'dialog', dialogTxt['exequo'], false );
			break;
			case 10 : 
				dialog.fadeTo( 300, 0, function() {
					dialog.remove();
				});
			break;
			case 11 :
				var canvas = new Canvas( false, 70 );
				
				dialog = display( 'dialog', dialogTxt['abort'], false );
				dialog.prepend( canvas._elm );
				canvas.draw( dialogTxt['winner']['team'] );
			break;
		}
		if ( anim ) {	
			// console.log( 'test' );
			setTimeout( function() {
				testTmpl( ++index, anim );
			}, time );
		}
	};
	
	testTmpl( 5, true );
	
});
