class Api::PhotosController < ApplicationController
  def index
    @photos = Photo.page(params[:page]).per(20).order_home
    @page = @photos.current_page
    @total_pages = @photos.total_pages

    render :index
  end

  def recent
    @photos = Photo.all.order("created_at desc").limit(5)
    @page = @total_pages = 1


    render :index
  end

  def loved
    @photos = Photo.most_loved
    @page = @total_pages = 1

    render :index
  end

  def show
    @photo = Photo.includes(:owner, :albums, :favorites, :tags).find(params[:id])
    @prev = @photo.order_home.previous
    @next = @photo.order_home.next

    render :show
  end
end