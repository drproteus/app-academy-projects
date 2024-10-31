class AlbumMembershipsController < ApplicationController
  before_filter :ensure_ownership, only: [:create]

  def create
    @membership = AlbumMembership.new(membership_params)
    if @membership.save
      redirect_to album_url(@membership.album)
    else
      flash[:errors] = @membership.errors.full_messages

      redirect_to photo_url(@membership.photo)
    end
  end

  def ensure_ownership
    unless Photo.find(membership_params[:photo_id]).owner == current_user &&
           Album.find(membership_params[:album_id]).owner == current_user
      render text: "404 :'["
    end
  end

  private
  def membership_params
    params.require(:album_membership).permit(:photo_id, :album_id)
  end
end
