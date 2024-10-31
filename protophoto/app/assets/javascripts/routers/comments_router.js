ProtoPhoto.Routers.CommentsRouter = Backbone.Router.extend({
  initialize: function(options) {
    this.$rootEl = options.$rootEl;
  },

  routes: {
    "/photos/:id": "photoView",
    "/users/:id": "userView"
  },

  photoView: function(id) {
    var photoComments = new ProtoPhoto.Collections.Comments({
      type: "Photo",
      id: id
    });
    photoComments.fetch();
    var view = new ProtoPhoto.Views.PhotoCommentsView({
      collection: photoComments
    });
    this._swapView(view);
  },

  userView: function (id) {
    var userComments = new ProtoPhoto.Collections.Comments({
      type: "User",
      id: id
    });
    userComments.fetch();
    var view = new ProtoPhoto.Views.UserCommentsView({
      collection: userComments
    });
    this._swapView(view);
  },

  _swapView: function(view) {
    _this.currentView && this.currentView.remove();
    _this.currentView = view;
    this.$rootEl.html(view.render().$el);
  }
});