(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject =
                      function(pos, vel, radius, color, game) {
    this.pos = pos;
    this.vel = vel;
    this.radius = radius;
    this.color = color;
    this.game = game;
  };

  MovingObject.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI,
      false
    );

    ctx.fill();
  };

  MovingObject.prototype.move = function () {
    var newPos = ([
                   (this.pos[0] + this.vel[0]),
                   (this.pos[1] + this.vel[1])
                 ]);

    if (this.game.isOutOfBounds(newPos)) {
      if (this.isWrappable) {
        newPos = this.game.wrap(newPos)
      }
      else {
        this.game.remove(this)
      }
    }

    this.pos[0] = newPos[0];
    this.pos[1] = newPos[1];
  };

  // MovingObject.prototype.isCollidedWith = function (otherObject) {
  //   var distance = Asteroids.Util.distance(this.pos, otherObject.pos);
  //   return (distance < this.radius + otherObject.radius);
  // };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    // wraps collision detection if necessary
    if (this.isWrappable && otherObject.isWrappable) {
      var nw = [this.pos[0] - this.game.width, this.pos[1] - this.game.height];
      var n  = [this.pos[0], this.pos[1] - this.game.height];
      var ne = [this.pos[0] + this.game.width, this.pos[1] - this.game.height];
      var e  = [this.pos[0] + this.game.width, this.pos[1]];
      var se = [this.pos[0] + this.game.width, this.pos[1] + this.game.height];
      var s  = [this.pos[0], this.pos[1] + this.game.height];
      var sw = [this.pos[0] - this.game.width, this.pos[1] + this.game.height];
      var w  = [this.pos[0] - this.game.width, this.pos[1]];

      var distances = [
        Asteroids.Util.distance(nw, otherObject.pos),
        Asteroids.Util.distance(n, otherObject.pos),
        Asteroids.Util.distance(ne, otherObject.pos),
        Asteroids.Util.distance(e, otherObject.pos),
        Asteroids.Util.distance(se, otherObject.pos),
        Asteroids.Util.distance(s, otherObject.pos),
        Asteroids.Util.distance(sw, otherObject.pos),
        Asteroids.Util.distance(w, otherObject.pos)
      ];

      for (var i = 0; i < distances.length; i++) {
        if (distances[i] < this.radius + otherObject.radius) {
          return true;
        }
      }
    }

    var distance = Asteroids.Util.distance(this.pos, otherObject.pos);
    return (distance < this.radius + otherObject.radius);
  }

  MovingObject.prototype.isWrappable = true;

})();