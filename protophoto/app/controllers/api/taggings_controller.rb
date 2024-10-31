class Api::TaggingsController < ApplicationController
  def create
    @photo = current_user.photos.find(tagging_params[:photo_id])
    new_taggings = parse_tags(tagging_params[:tags])

    render json: new_taggings
  end

  def destroy
    @tagging = current_user.taggings.find(params[:id])
    @tagging.destroy

    render json: {}
  end

  private
  def tagging_params
    params.require(:tagging).permit(:tags, :photo_id)
  end
end