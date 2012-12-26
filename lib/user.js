var _instances = 0;

function User( socket, name ) {
	// do something here to hide socketId
	this._id = socket.id; // str.slice
	
	this._socket = socket;
	this._name = name;
	
	this.score = 0;
	this.isPlaying = false;
	this.team;
	this.gameId;
	this.playedBoxes = [];
	
	this.isInGame = false;
};

User.prototype.setTeam = function( team ) {
	this.team = team;
};

User.prototype.play = function( boxId ) {
	this.playedBoxes.push( parseInt( boxId ) );
	return this.playedBoxes;
};

User.prototype._getInstances = function() {
	return _instances;
};

module.exports = User;