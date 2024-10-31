(function() {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Util = Asteroids.Util = function () {};

  Function.prototype.inherits = function(superclass) {
    var Surrogate = function() {};
    Surrogate.prototype = superclass.prototype;
    this.prototype = new Surrogate();
  };

  Util.randomVector = function(length) {
    var dxSign = Math.random() < 0.5 ? -1 : 1;
    var dySign = Math.random() < 0.5 ? -1 : 1;
    var dx = (Math.random() * length) * dxSign;
    var dy = (Math.random() * length) * dySign;

    return [dx, dy];
  };

  Util.distance = function(pos1, pos2) {
    x1 = pos1[0];
    x2 = pos2[0];
    y1 = pos1[1];
    y2 = pos2[1];

    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  };
})();