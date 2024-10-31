class Api::MapController < ApplicationController
  def index
    @photos = Photo.where("latitude IS NOT NULL AND longitude IS NOT NULL")

    render :index
  end
end