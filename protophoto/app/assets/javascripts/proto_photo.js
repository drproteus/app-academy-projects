window.ProtoPhoto = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function () {
    ProtoPhoto.photos = new ProtoPhoto.Collections.Photos();
    ProtoPhoto.photos.fetch();
    new ProtoPhoto.Routers.ProtoRouter({
      $rootEl: $("main")
    });
    Backbone.history.start({ pushState: true });
  }
};
$(document).ready(ProtoPhoto.initialize)