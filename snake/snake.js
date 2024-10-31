(function(){
  if (typeof SnakeJS === "undefined"){
    window.SnakeJS = {};
  }

  var Coord = SnakeJS.Coord = function(x, y) {
    this.x = x;
    this.y = y;
  };

  Coord.prototype.eq = function(otherCoord) {
    return (this.x === otherCoord.x && this.y === otherCoord.y);
  };

  Coord.prototype.plus = function(coord1, coord2) {
    return new Coord(coord1.x + coord2.x, coord1.y + coord2.y);
  };

  Coord.prototype.goNorth = function() {
    return Coord.prototype.plus(this, new Coord(0, -1));
  };

  Coord.prototype.goSouth = function() {
    return Coord.prototype.plus(this, new Coord(0, 1));
  };

  Coord.prototype.goEast = function() {
    return Coord.prototype.plus(this, new Coord(1, 0));
  };

  Coord.prototype.goWest = function() {
    return Coord.prototype.plus(this, new Coord(-1, 0));
  };

  var Snake = SnakeJS.Snake = function(board){
    this.dir = "S"
    this.board = board;
    this.segments = [new Coord(board.width / 2, 2), 
                     new Coord(board.width / 2, 1), 
                     new Coord(board.width / 2, 0)];
  };

  Snake.prototype.move = function(){
    if (!this.board.over) {
      this.checkWin();

      var newHead;
      var currHead = this.segments[0];
      if (this.dir === "N"){
        newHead = currHead.goNorth();
      }
      else if (this.dir === "S") {
        newHead = currHead.goSouth();
      }
      else if (this.dir === "E") {
        newHead = currHead.goEast();
      }
      else {
        newHead = currHead.goWest();
      }
      if (!this.ateApple(newHead)) {
        this.segments.pop();
      }
      this.segments = [newHead].concat(this.segments);
    }
  };

  Snake.prototype.isOutOfBounds = function() {
    for (var i = 0; i < this.segments.length; i++) {
      if (this.segments[i].x < 0 || this.segments[i].x >= this.board.width || this.segments[i].y < 0 || this.segments[i].y >= this.board.height) {
        return true;
      }
    }
    return false;
  };

  Snake.prototype.hasHitSelf = function() {
    for (var i = 0; i < this.segments.length; i++) {
      for (var j = i + 1; j < this.segments.length; j++) {
        if (this.segments[i].eq(this.segments[j])) {
          return true;
        }
      }
    }
    return false;
  };

  Snake.prototype.checkWin = function() {
    if (this.isOutOfBounds() || this.hasHitSelf()) {
      this.board.over = true;
      $(".game-over").addClass("revealed");
    }
  };

  Snake.prototype.ateApple = function(coord) {
    if (this.board.appleAt(coord)) {
      this.board.eatApple(coord);
      return true;
    }
    return false;
  };

  Snake.prototype.turn = function(newdir) {
    this.dir = newdir;
  };

  Snake.prototype.turnRight = function(){
    if (this.dir === "N"){
      this.turn("E");
    }
    else if (this.dir === "E"){
      this.turn("S");
    }
    else if (this.dir === "S"){
      this.turn("W");
    }
    else {
      this.turn("N");
    }
  }
  Snake.prototype.turnLeft = function(){
    if (this.dir === "N"){
      this.turn("W");
    }
    else if (this.dir === "E"){
      this.turn("N");
    }
    else if (this.dir === "S"){
      this.turn("E");
    }
    else {
      this.turn("S");
    }
  }

  Snake.prototype.isAt = function(coord) {
    for (var i = 0; i < this.segments.length; i++) {
      if (this.segments[i].eq(coord)) {
        return true;
      }
    }
    return false;
  };

  var Board = SnakeJS.Board = function(width, height) {
    this.apples = [];
    this.width = width;
    this.height = height;
    this.snake = new Snake(this);
    this.score = 0;
    this.over = false;
  };

  Board.prototype.newApple = function() {
    if (!this.over) {
      var candidate = new SnakeJS.Coord(Math.floor(Math.random() * this.width),
                                        Math.floor(Math.random() * this.height));
      if (this.snake.isAt(candidate) || this.appleAt(candidate)) {
        this.apples.push(this.newApple());
      } else {
        this.apples.push(candidate);
      }
    }
  };

  Board.prototype.appleAt = function(coord) {
    for (var i = 0; i < this.apples.length; i++) {
      if (this.apples[i] === undefined) { continue; }
      if (this.apples[i].eq(coord)) {
        return true;
      }
    }
    return false;
  };

  Board.prototype.eatApple = function(coord) {
    var appleIndex;
    for (var i = 0; i < this.apples.length; i++) {
      if (this.apples[i] === "undefined") { continue; }
      if (this.apples[i].eq(coord)) {
        appleIndex = i;
        break;
      }
    }
    this.apples[appleIndex] = this.apples[this.apples.length - 1];
    this.apples = this.apples.slice(0, -1);
    this.score += 10;
  };

  Board.prototype.render = function() {
    var renderString = "";
    for (var i = 0; i < this.height; i++) {
      var rowString = "";
      for (var j = 0; j < this.width; j++) {
        coord = new SnakeJS.Coord(j, i);
        if (this.snake.isAt(coord)) {
          rowString += "S";
        } else if (this.appleAt(coord)) {
          rowString += "A";
        } else {
          rowString += ".";
        }
      }
      rowString += "\n";
      renderString += rowString;
    }
    return renderString;
  };

})();
