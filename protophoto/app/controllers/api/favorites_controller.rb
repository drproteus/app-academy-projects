class Api::FavoritesController < ApplicationController
  def create
    @favorite = current_user.favorites.new(photo_id: params[:photo_id])
    if @favorite.save
      # yay
    else
      render text: "you done goofed now"
    end
  end

  def destroy
    @favorite = current_user.favorites.find_by(photo_id: params[:photo_id])
    @favorite.destroy
    # yay
  end
end
