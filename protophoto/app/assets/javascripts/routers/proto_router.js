ProtoPhoto.Routers.ProtoRouter = Backbone.Router.extend({
  initialize: function (options) {
    this.$rootEl = options.$rootEl
  },

  routes: {
    "photos": "index",
  },

  index: function (options) {
    var indexPhotos = new ProtoPhoto.Collections.Photos();
    indexPhotos.fetch({});
    var indexView = new ProtoPhoto.Views.PhotosIndex({
      collection: indexPhotos,
      pageTitle: "All Photos"
    });

    this._swapView(indexView);
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  }
});