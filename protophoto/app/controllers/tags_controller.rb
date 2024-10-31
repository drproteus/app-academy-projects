class TagsController < ApplicationController
  def index
    @tags = Tag.order("name asc").page(params[:page]).per(50)

    render :index
  end

  def show
    @tag = Tag.find(params[:id])
    @photos = @tag.photos.order_home.page(params[:page]).per(20)

    render :show
  end
end
