class FavoritesController < ApplicationController
  def create
    @favorite = current_user.favorites.new(photo_id: params[:photo_id])
    if @favorite.save
      redirect_to photo_url(params[:photo_id])
    else
      render text: "you done goofed now"
    end
  end

  def destroy
    @favorite = current_user.favorites.find_by(photo_id: params[:photo_id])
    @favorite.destroy
    redirect_to photo_url(params[:photo_id])
  end

  def index
    @photos = current_user.favorite_photos.order_home.page(params[:page]).per(20)

    render :index
  end
end