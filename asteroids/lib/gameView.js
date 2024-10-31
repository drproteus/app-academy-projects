(function() {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  GameView.prototype.start = function() {
    this.bindKeyHandlers();
    var that = this;
    window.setInterval(function() {
      that.game.step();
      that.game.draw(this.ctx);
      that.checkGameStatus();
    }, 20);
  };

  GameView.prototype.bindKeyHandlers = function () {
    var that = this;
    key("up", function(event) { event.preventDefault(); that.game.ship.power(1); });
    key("down", function(event) { event.preventDefault(); that.game.ship.brake(2); });

    key("left", function(event) { event.preventDefault(); that.game.ship.steer(Math.PI/8); });
    key("right", function(event) { event.preventDefault(); that.game.ship.steer(-Math.PI/8); });

    key("space", function(event) { event.preventDefault(); that.game.ship.fireBullet(); });
  };

  GameView.prototype.checkGameStatus = function() {
    if (this.game.hasWon()) {
      this.newGame();
    } else if (this.game.hasLost()) {
      // alert("YOU HAVE MET WITH A TERRIBLE FATE");
      window.location.reload();
    };
  };

  GameView.prototype.newGame = function () {
    var wasMuted = false;
    if (this.game.muted) {
      var wasMuted = true;
    }
    this.game = new Asteroids.Game();
    this.game.muted = wasMuted;
  };

  GameView.prototype.toggleSound = function () {
    if (this.game.muted) {
      this.game.muted = false;
    } else {
      this.game.muted = true;
    }
  };
})();
