ProtoPhoto.Collections.Photos = Backbone.Collection.extend({
  url: "/api/photos",

  model: ProtoPhoto.Models.Photo,

  parse: function(response) {
    this.page = response.page;
    this.total_pages = response.total_pages;
    return response.photos;
  }
});