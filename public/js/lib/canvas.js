var Canvas = function( window, document, $, undefined ) {
	var Canvas = function( id, size ) {
		var size = size || 200;
		
		 // set to false in game.launch() { _view.unfreeze() }
		this.isLocked = true;
		
		// if ( this._id === false )
		// the canvas is just a illustration
		this._id = id;
		this._elm = document.createElement( 'canvas' );
		
		this.width = this._elm.width = size;
		this.height = this._elm.height = size;
		this._elm.id = 'canvas_' + this._id;
		this._elm.setAttribute( 'data-id', this._id );
		
		this.ctx = this._elm.getContext( '2d' );
		this.ctx.lineWidth = 2;
		this.ctx.shadowBlur = 2;
		
		this.colors = {
			cross : '#EE0000',
			circle : '#006700'
		};
		this.shadows = {
			cross : '#CC0022',
			circle : '#008811'
		}
	}
	
	Canvas.prototype.circle = function() {
		this.ctx.beginPath();
		this.ctx.arc( this.width / 2, this.height / 2, this.width / 3, 0, Math.PI * 2, true );
		this.ctx.stroke();
		this.ctx.closePath();			
	};
	
	Canvas.prototype.cross = function() {
		this.ctx.beginPath();
		this.ctx.moveTo( this.width / 5, this.height / 5 );
		this.ctx.lineTo( this.width - (this.width / 5), this.height - (this.height / 5) );
		this.ctx.moveTo( this.width / 5, this.height - ( this.height / 5 ) );
		this.ctx.lineTo( this.width - ( this.width / 5 ), this.height / 5 );
		this.ctx.stroke();
		this.ctx.closePath();
	};
	
	Canvas.prototype.draw = function( team ) {
		// canvas width _id === false are decorative...
		if ( this._id !== false && this.isLocked ) { return; }
		
		this.ctx.strokeStyle = this.colors[team];
		this.ctx.shadowColor = this.shadows[team];
		this[team]();	
		this.isLocked = true;
	};
	
	return Canvas;
}( window, document, jQuery );