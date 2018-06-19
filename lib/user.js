var _instances = 0;

function User( socket, name ) {
	this._id = socket.id;
	
	this._socket = socket;
	this._name = name;
	
	this.score = 0;
	this.isPlaying = false;
	this.team;
	this.gameId;
	this.playedBoxes = [];
	
	this.isInGame = false;
};

User.prototype.play = function( boxId ) {
	this.playedBoxes.push( parseInt( boxId ) );
	return this.playedBoxes;
};

User.prototype.setTeam = function( team ) {
	this.team = team;
};

User.prototype._getInstances = function() {
	return _instances;
};

module.exports = User;