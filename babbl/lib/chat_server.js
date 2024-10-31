var createChat = function(server) {
  this.guestnumber = 1;
  this.nicknames = {};
  this.roomAssignments = {};

  var io = require('socket.io')(server);
  var that = this;

  var updateUserList = function (room) {
    userList = [];
    Object.keys(that.nicknames).forEach(function(key) {
      if (that.roomAssignments[key] === room) {
        userList.push(that.nicknames[key]);
      }
    });
    io.to(room).emit('updateUserDisplay', { userList: userList, room: room });
  };

  io.on('connection', function (socket) {
    var room = function() { return that.roomAssignments[socket.id]; }
    that.nicknames[socket.id] = "Guest " + that.guestnumber++;
    that.roomAssignments[socket.id] = 'lobby';
    socket.join('lobby');
    updateUserList('lobby');
    socket.broadcast.to(room()).emit('message', {
      author: "Server",
      text: that.nicknames[socket.id] + " has joined 'lobby'"
    });
    socket.emit('message', {
      author: "Server",
      text: "WELCOME, HUMAN."
    });
    socket.on('message', function(data) {
      if (data.text[0] === '/') {
        var args = data.text.slice(1).split(" ");
        args = args.slice(0, 1).concat(args.slice(1).join(" "));
        if (args[0] === 'nick') {
          nicknameChangeRequest({ nickname: args[1] });
        } else if (args[0] === 'clear') {
          socket.emit('clear', {});
        } else if (args[0] === 'join') {
          roomChangeRequest({ room: args[1] });
        } else {
          socket.emit('message', { author: "Server", text: "Excuse me?" });
        }
      } else { // regular input, not a command
        io.to(room()).emit('message', {
          text: data.text,
          author: that.nicknames[socket.id]
        });
      }
    });

    socket.on('disconnect', function() {
      io.to(room()).emit('message', {
        author: "Server",
        text: that.nicknames[socket.id] + " has disconnected."
      })
      delete that.nicknames[socket.id];
      updateUserList(room());
      delete that.roomAssignments[socket.id];
    });

    socket.on('refreshlist', function () {
      updateUserList(room());
    });

    var nicknameChangeRequest = function (data) {
      var re = /[gG]uest\d*/;
      if (!re.exec(data.nickname) && data.nickname.length > 0) {
        var oldnick = that.nicknames[socket.id]
        that.nicknames[socket.id] = data.nickname;
        io.to(room()).emit('nicknameChangeResult', {
          success: true,
          message: "'" + oldnick + "'" + " is now known as '" + data.nickname + "'"
        });
        updateUserList(room());
      } else {
        socket.emit('nicknameChangeResult', {
          success: false,
          message: "Name must be present and cannot begin with Guest/guest"
        });
      }
    };

    var roomChangeRequest = function (data) {
      var newRoom = data.room;
      socket.broadcast.to(room()).emit('message', {
        author: "Server",
        text: that.nicknames[socket.id] + " has left the room."
      });
      socket.leave(room());
      that.roomAssignments[socket.id] = newRoom;
      socket.join(newRoom);
      socket.emit('clear', { refresh: true });
      socket.emit('message', { author: "Server", text: "Joined " + "'" + newRoom + "'" });
      socket.broadcast.to(newRoom).emit('message', {
        author: "Server",
        text: that.nicknames[socket.id] + " has joined '" + newRoom + "'"
      });
    };
  });
};

module.exports.createChat = createChat;