(function(){
  if (typeof SnakeJS === "undefined") {
    window.SnakeJS = {};
  }

  var View = SnakeJS.View = function($el) {
    this.$el = $el;
    this.board = new SnakeJS.Board(20, 20);
    this.bindEvents();
    var that = this;
    window.setInterval(function() {
      that.step();
    }, 250);
    window.setInterval(function() {
      that.board.newApple();
    }, 8000);
    this.render();
  };

  View.prototype.bindEvents = function() {
    var that = this;
    $(document).on("keydown",function(event) {
      if (event.which === 39) {
        that.board.snake.turnRight();
      }
      else if (event.which === 37) {
        that.board.snake.turnLeft();
      }
    });

    $(".touch-right").on("click", function(event) {
      that.board.snake.turnLeft();
    });

    $(".touch-left").on("click", function(event) {
      that.board.snake.turnRight();
    });
  }

  View.prototype.step = function() {
    this.board.snake.move();
    this.$el.text(this.render());
    $(".score").text(this.board.score);
  };

  View.prototype.render = function() {
    $("ul").remove();
    var $snakeView = $($(".snake"));
    var renderString = this.board.render();
    var grid = renderString.split('\n');
    for (var i = 0; i < grid.length; i++) {
      var row = grid[i];
      var $row = $(document.createElement("ul"));
      for (var j = 0; j < row.length; j++) {
        var $cell = $(document.createElement("li"));
        if (row[j] === '.') {
          $cell.addClass("empty");
        } else if (row[j] === 'S') {
          $cell.addClass("snake-cell");
        } else if (row[j] === 'A') {
          $cell.addClass("apple");
        }
        $row.append($cell);
      }
      $snakeView.append($row);
    }
  }
})();