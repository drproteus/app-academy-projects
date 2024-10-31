$(document).ready(function () {
  var socket = io();
  var chat = new ChatApp.Chat(socket);

  var getMessageText = function ($form, selector) {
    var text = $form.find(selector).val();
    $form.find(selector).val("");
    return text;
  };

  var addMessage = function (selector, data) {
    var $msgEl = $("<div>");
    if (data.author === "Server") { $msgEl.addClass("server"); }
    $msgEl.addClass("message");

    var $from = $("<strong>");
    $from.addClass("author");
    $from.text(data.author);

    var $msgTxt = $("<p>");
    $msgTxt.addClass("message-body");
    $msgTxt.text(data.text);

    $msgEl.append($from);
    $msgEl.append($msgTxt);

    $(selector).append($msgEl);

    // always show latest messages
    $(selector).scrollTop($(selector)[0].scrollHeight);
  };

  $("#send-message").on("submit", function(event) {
    event.preventDefault();
    $currentTarget = $(event.currentTarget);

    var msgText = getMessageText($currentTarget, "#message-text");

    chat.sendMessage(msgText);
  });

  socket.on('message', function (data) {
    addMessage(".messages", data);
  });

  socket.on('nicknameChangeResult', function(data) {
    addMessage(".messages", { author: "Server", text: data.message });
  });

  socket.on('updateUserDisplay', function(data) {
    displayUsers(".connected-users", data);
  });

  socket.on('clear', function (data) {
    $(".messages").empty();
    if (data.refresh) {
      socket.emit('refreshlist');
    }
  });

  var displayUsers = function(selector, data) {
    $(selector).empty();
    $userList = $("<ul>");
    data.userList.forEach(function (user) {
      $user = $("<li>");
      $user.text(user);
      $userList.append($user);
    });

    $(selector).append("<h3>"+data.room+"</h3>");
    $(selector).append($userList);
  }
});