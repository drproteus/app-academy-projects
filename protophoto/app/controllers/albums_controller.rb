class AlbumsController < ApplicationController
  def new
    @album = current_user.albums.new
    @photos = current_user.photos

    render :new
  end

  def create
    @album = current_user.albums.new(album_params)
    if @album.save
      redirect_to album_url(@album)
    else
      flash.now[:errors] = @album.errors.full_messages
      @photos = current_user.photos

      render :new
    end
  end

  def edit
    @album = current_user.albums.find(params[:id])
    @photos = current_user.photos

    render :edit
  end

  def show
    @album = Album.find(params[:id])
    @photos = @album.photos.order_home.page(params[:page]).per(20)
  end

  def update
    @album = current_user.albums.find(params[:id])
    if @album.update(album_params)
      redirect_to album_url(@album)
    else
      flash.now[:errors] = @album.full_messages
      @photos = current_user.photos

      render :edit
    end
  end

  def destroy
    @album = current_user.albums.find(params[:id])
    @album.destroy
    redirect_to user_url(current_user)
  end

  private
  def album_params
    params.require(:album).permit(:title, :description, photo_ids: [])
  end
end
