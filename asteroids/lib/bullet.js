(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Bullet = Asteroids.Bullet = function(pos, game, angle) {
    Asteroids.MovingObject.call(this,
      [pos[0], pos[1]],
      [Math.cos(angle) * Bullet.SPEED, -Math.sin(angle) * Bullet.SPEED],
      Bullet.RADIUS,
      Bullet.COLOR,
      game);
      this.angle = angle;

      game.bullets.push(this);
  };

  Bullet.COLOR = "white";
  Bullet.SPEED = 20;
  Bullet.RADIUS = 4;

  Bullet.inherits(Asteroids.MovingObject);

  Bullet.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof Asteroids.Asteroid) {
      otherObject.explode();
      this.game.remove(this);
    }
  };

  Bullet.prototype.draw = function(ctx) {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo((this.pos[0] + Math.cos(this.angle) * (this.radius + 20)),
               (this.pos[1] - Math.sin(this.angle) * (this.radius + 20)));
    
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  Bullet.prototype.isWrappable = false;
})();