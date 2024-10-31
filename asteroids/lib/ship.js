(function() {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Ship = Asteroids.Ship = function(pos, game) {
    Asteroids.MovingObject.call(this,
                      pos,
                      [0, 0],
                      Ship.RADIUS,
                      Ship.COLOR, game);
    this.angle = Math.PI / 2;
    this.sprite = new Image();
    this.sprite.src = "assets/ship.png";
    this.exploded = false;

    this.laserSound = new Audio("assets/laser.wav");
  };

  Ship.inherits(Asteroids.MovingObject);

  Ship.COLOR = "black";
  Ship.RADIUS = 15;
  Ship.MAXSPEED = 10;

  Ship.prototype.relocate = function() {
    this.vel = [0, 0];
    this.pos = this.game.randomPos();
  };

  Ship.prototype.power = function (impulse) {
    new_vx = this.vel[0] + Math.cos(this.angle) * impulse;
    new_vy = this.vel[1] - Math.sin(this.angle) * impulse;

    this.vel = [new_vx, new_vy];
  };

  Ship.prototype.steer = function (direction) {
    this.angle += direction
    if (this.angle < 0) {
      this.angle += Math.PI * 2;
    }
    else if (this.angle > Math.PI * 2) {
      this.angle -= Math.PI * 2;
    }
  };

  Ship.prototype.brake = function (impulse) {
    this.vel = [this.vel[0]/impulse, this.vel[1]/impulse];
  };

  Ship.prototype.fireBullet = function() {
    var bullet = new Asteroids.Bullet(this.pos, this.game, this.angle);
    if (!this.game.muted) {
      this.laserSound.play();
      this.laserSound.currentTime = 0;
    }
  };

  Ship.prototype.draw = function(ctx) {
    ctx.save();

    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(Math.PI/2 - this.angle);

    ctx.drawImage(this.sprite, -this.radius - 10,
                               -this.radius - 10,
                               this.radius * 2 + 20,
                               this.radius * 2 + 20);
    ctx.restore();
  };

})();
