(function() {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Game = Asteroids.Game = function() {
    this.width = Game.DIM_X;
    this.height = Game.DIM_Y;
    this.asteroids = [];
    this.bullets = [];
    this.ship = new Asteroids.Ship([300, 300], this);
    this.addAsteroids();
    this.muted = false;
  };

  Game.DIM_X = 600;
  Game.DIM_Y = 600;
  Game.NUM_ASTEROIDS = 4;

  Game.prototype.addAsteroids = function () {
    for (var i = 0; i < Game.NUM_ASTEROIDS; i++) {
      this.asteroids.push(this.randomAsteroid());
    }
  };

  Game.prototype.randomAsteroid = function() {
    var candidate = new Asteroids.Asteroid(this.randomPos(), this);
    var gameObjects = this.allObjects();
    for (var i = 0; i < this.asteroids.length; i++) {
      if (candidate.isCollidedWith(gameObjects[i])) {
        return this.randomAsteroid();
      }
    }

    return candidate;
  }

  Game.prototype.randomPos = function () {
    var px = Math.floor(Math.random() * this.width);
    var py = Math.floor(Math.random() * this.height);

    return [px, py]
  };

  Game.prototype.draw = function(ctx) {
    var objects = this.allObjects()
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

    objects.forEach(function(object) {
      object.draw(ctx);
    });
  };

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function(object) {
      object.move();
    });
  };

  Game.prototype.wrap = function(pos) {
    var px = pos[0];
    var py = pos[1];
    var new_pos = [px, py];

    if (px < 0) {
      new_pos[0] = this.width - px;
    } else if (px > this.width) {
      new_pos[0] = px - this.width;
    }

    if (py < 0) {
      new_pos[1] = this.height - py;
    } else if (py > this.height) {
      new_pos[1] = py - this.height;
    }

    return new_pos;
  };

  Game.prototype.checkCollisions = function () {
    var objects = this.allObjects();
    for (var i = 0; i < objects.length; i++) {
      for (var j = i + 1; j < objects.length; j++) {
        obj2 = objects[i];
        obj1 = objects[j];
        if (!!obj1.exploded || !!obj2.exploded) { continue; }
        if (obj1.isCollidedWith(obj2)) {
          try {
            obj1.collideWith(obj2);
          } catch (e) {
            console.log("Wat");
          }
        }
      }
    };
  };

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCollisions();
  };

  Game.prototype.remove = function (object) {
    if (object instanceof Asteroids.Asteroid) {
      idx = this.asteroids.indexOf(object);
      this.asteroids.splice(idx, 1);
    }
    else if (object instanceof Asteroids.Bullet) {
      idx = this.bullets.indexOf(object);
      this.bullets.splice(idx, 1);
    }
  };

  Game.prototype.allObjects = function() {
    return this.bullets.concat(this.ship).concat(this.asteroids);
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < 0 || pos[0] > this.width) ||
           (pos[1] < 0 || pos[1] > this.height);
  };

  Game.prototype.hasWon = function() {
    return (this.asteroids.length === 0);
  };

  Game.prototype.hasLost = function() {
    return (this.ship.exploded);
  };

  Game.prototype.addAsteroidFragments = function(pos, vel, radius) {
    var fragments = [
      new Asteroids.Asteroid([pos[0], pos[1] - radius], this),
      new Asteroids.Asteroid([pos[0] - radius, pos[1]], this),
      new Asteroids.Asteroid([pos[0], pos[1] + radius], this),
      new Asteroids.Asteroid([pos[0] + radius, pos[1]], this)
    ];
    for (var i = 0; i < 4; i++) {
      var angle = Math.random() * Math.PI * 2;
      fragments[i].radius = radius / 2;
      fragments[i].vel = [Math.cos(i * angle) * vel[0],
                          Math.sin(i * angle) * vel[1]];
      this.asteroids.push(fragments[i]);
    }
  };
})();
