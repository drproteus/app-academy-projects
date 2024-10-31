class TaggingsController < ApplicationController
  def create
    @photo = current_user.photos.find(tagging_params[:photo_id])
    parse_tags(tagging_params[:tags])
    
    redirect_to photo_url(@photo)
  end

  def destroy
    @tagging = current_user.taggings.find(params[:id])
    @tagging.destroy
    redirect_to photo_url(@tagging.photo)
  end

  private
  def tagging_params
    params.require(:tagging).permit(:tags, :photo_id)
  end
end
