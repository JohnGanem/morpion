var _gameInstances = 0;

function Game() {
    this._id = ++_gameInstances;
    this._MAX_PLAYERS = 2;
    this._TEAMS = ['cross', 'circle'];
    this._NAME = 'morpion';

    this.players = {};
    // this.isPlaying;
    this.nbrPlayers = 0;
    this.playedBoxes = [];

    this.turn = 0;
    this.size = 3;
    this.board = {};
    for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
            this.board[x * y] = x + y;
        }
    }
}

Game.prototype.setPlayer = function (user) {
    if (this.nbrPlayers < this._MAX_PLAYERS) {
        this.players[ user._id ] = user;
        this.players[ user._id ].isInGame = true;
        return ++this.nbrPlayers;
    } else {
        return false;
    }
};

Game.prototype.deletePlayer = function (userId) {
    if (this.players[ userId ]) {
        var team = this.players[ userId ].team;
        delete this.players[ userId ];
        this.nbrPlayers -= 1;
        this.share('game.abort', {team: team});
    }
}

Game.prototype.launch = function () {
    this.playedBoxes = [];

    var data = {
        players: {},
        begins: this._TEAMS[ Math.floor((Math.random() * 2)) ]
    },
            teamIndex = 0;

    for (var id in this.players) {
        this.players[ id ].team = this._TEAMS[ teamIndex ];
        this.players[ id ].gameId = this._id;
        this.players[ id ].playedBoxes = [];

        // si le joueur commence
        if (this.players[ id ].team == data.begins) {
            this.isPlaying = id;
            this.players[ id ].isPlaying = true
        }

        data.players[ id ] = {
            id: id,
            name: this.players[ id ]._name,
            team: this.players[ id ].team,
            score: this.players[ id ].score
        };

        teamIndex = 1;
    }

    this.share('game.launch', data);
};

Game.prototype.deal = function (data) {
    if (!this.players[ data.player ]) {
        return;
    }

    if (!this.players[ data.player ].isPlaying) {
        this.players[ data.player ]._socket.emit('deal.refused');
        return;
    }

    this.players[ data.player ]._socket.emit('deal.accepted', data);
    this.broadcast(data.player, 'enemy.play', {box: data.box});

    this.playedBoxes.push(data.box);
    playerBoxes = this.players[ data.player ].play(data.box);

    var result = this.testPaths(playerBoxes);

    if (result) {
        this.players[ data.player ].score += 1;

        this.share('winner.is', {
            player: data.player,
            team: this.players[ data.player ].team,
            scheme: result,
            score: this.players[ data.player ].score
        });
    } else if (this.playedBoxes.length === (this.size * this.size)) {
        this.share('ex.aequo');
    }

    this.togglePlayer(data.player);
};

Game.prototype.testPaths = function (boxesPlayed) {
    var index, test;

    for (var path in this.validPaths) {
        test = [];
        for (var val in this.validPaths[ path ]) {
            index = boxesPlayed.indexOf(this.validPaths[ path ][ val ]);
            test.push(index);
        }

        if (test.indexOf(-1) === -1) {
            return this.validPaths[ path ];
        }
    }
    return false;
}

Game.prototype.togglePlayer = function (lastPlayerId) {
    for (var id in this.players) {
        this.players[ id ].isPlaying = (id !== lastPlayerId);
    }
};

Game.prototype.broadcast = function (senderId, channel, data) {
    var data = data || {};

    for (var id in this.players) {
        if (id !== senderId) {
            this.players[ id ]._socket.emit(channel, data);
        }
    }
};

Game.prototype.share = function (channel, data) {
    var data = data || {};

    for (var id in this.players) {
        this.players[ id ]._socket.emit(channel, data);
    }
};

Game.prototype.reset = function () {
    this.players = [];
}

Game.prototype.trace = function () {
    for (var i in this.players) {
        console.log(this.players[i]._name);
    }
}

module.exports = new Game();