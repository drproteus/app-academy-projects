$(document).ready(function () {
  $(".comments").on("click", ".delete-comment", function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    var commentId = $currentTarget.attr("id");
    var $comment = $(".comments").find("#"+commentId);
    $.ajax({
      url: "/api/comments/"+commentId,
      dataType: "json",
      type: "DELETE",
      success: function (data) {
        $comment.remove();
      }
    })
  });
  var appendComment = function (comment) {
    template = _.template('<div class="well comment posted-comment" id="<%= comment.id %>"><img src="<%= comment.author_avatar_url %>" class="img-circle"> <strong><a href="<%= comment.author_url %>"><%= comment.author_email %></a></strong> <span>posted <%= moment(comment.created_at).fromNow() %></span><p class="comment-body"><%- comment.content %></p><button class="btn btn-default btn-xs btn-danger delete-comment" id="<%= comment.id %>">Remove Comment</button></div>');
    $(".comments").prepend(template({comment: comment}));
    window.setTimeout(function () {
      $(".posted-comment").css("box-shadow", "none");
    }, 500);
    window.scrollBy(0, 150);
  };
  $(".new-comment").on("submit", function (event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    var newComment = $currentTarget.serializeJSON();
    $.ajax({
      dataType: "json",
      url: "/api/comments",
      type: "POST",
      data: newComment,
      success: function (data) {
        appendComment(data);
        $currentTarget.find("#comment_content").val("");
      }
    });
  });
});
