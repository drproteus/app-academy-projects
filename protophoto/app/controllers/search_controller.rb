class SearchController < ApplicationController
  def index
    if params[:query]
      @query = params[:query]
      @photos = Photo.search(@query)
      @tagged_photos = Photo.tag_search(@query)
      @users = User.search(@query)
      @albums = Album.search(@query)
    end

    render :index
  end
end
