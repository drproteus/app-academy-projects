ProtoPhoto.Views.PhotosIndex = Backbone.View.extend({
  template: JST["photos/index"],

  events: {
    "click #next": "fetchMore"
  },

  initialize: function (options) {
    _.bindAll(this, 'detectScroll');
    $(window).scroll(this.detectScroll);

    this.listenTo(this.collection, "sync add change", this.render);
    this.pageTitle = options.pageTitle;
    this.page = 1;
  },

  render: function () {
    var renderedContent = this.template({ photos: this.collection, title: this.pageTitle });
    this.$el.html(renderedContent);
    return this;
  },

  detectScroll: function (event) {
    if ($(document).height() <= $(window).scrollTop() + $(window).height()) {
      this.fetchMore();
    }
  },

  fetchMore: function () {
    this.collection.fetch({
      remove: false,
      data: { page: ++this.page },
      success: function() {}
    })
  }
});