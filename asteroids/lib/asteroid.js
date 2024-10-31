(function() {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function(pos, game) {
    Asteroids.MovingObject.call(this,
                      pos,
                      Asteroids.Util.randomVector(2),
                      Asteroid.randomRadius(),
                      Asteroid.COLOR, game);
    this.sprite = new Image();
    this.sprite.src = "assets/asteroid.png"
    this.exploded = false;

    this.explodeSound = new Audio("assets/boom2.wav");
  };

  Asteroid.inherits(Asteroids.MovingObject);

  Asteroid.COLOR = "#BDBDBD";
  Asteroid.RADIUS = 30;

  Asteroid.randomRadius = function() {
    return Asteroid.RADIUS + Math.floor(Math.random() * Asteroid.RADIUS);
  }

  Asteroid.prototype.collideWith = function(otherObject) {
    if (otherObject instanceof Asteroids.Ship) {
      otherObject.relocate();
      // otherObject.exploded = true;
    } else if (otherObject instanceof Asteroids.Bullet) {
      this.explode();
      this.game.remove(otherObject);
    } else if (otherObject instanceof Asteroids.Asteroid) {
      var tempVel = otherObject.vel;
      otherObject.vel = this.vel;
      this.vel = tempVel;
    }
  };

  Asteroid.prototype.draw = function(ctx) {
    ctx.drawImage(this.sprite, this.pos[0] - this.radius,
                               this.pos[1] - this.radius,
                               this.radius * 2, this.radius * 2);

    var nw = [this.pos[0] - this.game.width, this.pos[1] - this.game.height];
    var n  = [this.pos[0], this.pos[1] - this.game.height];
    var ne = [this.pos[0] + this.game.width, this.pos[1] - this.game.height];
    var e  = [this.pos[0] + this.game.width, this.pos[1]];
    var se = [this.pos[0] + this.game.width, this.pos[1] + this.game.height];
    var s  = [this.pos[0], this.pos[1] + this.game.height];
    var sw = [this.pos[0] - this.game.width, this.pos[1] + this.game.height];
    var w  = [this.pos[0] - this.game.width, this.pos[1]];

    wrapPositions = [nw, n, ne, e, se, s, sw, w];
    var that = this;
    wrapPositions.forEach(function (pos) {
      ctx.drawImage(that.sprite, pos[0] - that.radius, pos[1] - that.radius,
                    that.radius * 2, that.radius * 2);
    });
  };

  Asteroid.prototype.explode = function() {
    if (!this.game.muted) {
      this.explodeSound.play();
      this.explodeSound.currentTime = 0;
    }
    this.sprite.src = "assets/explosion.png";
    this.exploded = true;
    if (this.radius > 30) {
      this.game.addAsteroidFragments(this.pos, this.vel, this.radius);
    }
    this.vel = [0, 0];
    var that = this;
    setTimeout(function() {
      that.game.remove(that);
    }, 75);
  };
})();
