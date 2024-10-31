class PhotosController < ApplicationController
  before_filter :ensure_logged_in, only: [:new, :create, :update, :destroy]

  def new
    @photo = current_user.photos.new

    render :new
  end

  def show
    @user = User.find_by(id: params[:user_id]) if params[:user_id]
    @album = Album.find_by(id: params[:album_id]) if params[:album_id]
    @tags = Tag.find_by(id: params[:tag_id]) if params[:tag_id]
    @favorites = current_user.favorite_photos if params[:favorites]
    @url_options = {}
    if @album 
      @scope = @album.photos
      @url_options[:album_id] = @album.id
    elsif @user
      @scope = @user.photos
      @url_options[:user_id] = @user.id
    elsif @tags
      @scope = @tags.photos
      @url_options[:tag_id] = @tag.id
    elsif @favorites
      @scope = @favorites
      @url_options[:favorites] = "plz"
    else
      params.keys.each do |key|
        if Photo.first.attributes.has_key?(key)
          next if key == "id"
          @scope = Photo.where("#{key} LIKE ?", "%#{params[key]}%")
          @url_options[key.to_sym] = params[key]
        end
      end
    end
    @scope ||= Photo

    @photo = @scope.includes(:owner, :albums, :favorites, :tags).find(params[:id])
    @prev = @photo.order_home(@scope).previous
    @next = @photo.order_home(@scope).next
    @count = @scope.count(:all)
    @pos = @photo.order_home(@scope).position


    render :show
  end

  def index
    @photos = Photo.order_home.page(params[:page]).per(20)

    render :index
  end

  def edit
    @photo = current_user.photos.find(params[:id])

    if @photo.nil?
      flash[:errors] = ["Unable to edit a photo that doesn't exist or doesn't belong to you."]
      redirect_to root_url
    else
      render :edit
    end
  end

  def create
    @photo = current_user.photos.new(photo_params)
    parse_tags(params[:photo][:tags])
    if @photo.save
      flash[:success] = ["Upload successful!"]

      redirect_to photo_url(@photo)
    else
      flash[:errors] = @photo.errors.full_messages

      redirect_to new_photo_url
    end
  end

  def update
    @photo = current_user.photos.find(params[:id])
    if @photo.nil?
      flash[:errors] = ["Unabe to update a photo that doesn't exist or doesn't belong to you."]
      redirect_to root_url
      return
    end

    if @photo.update(photo_params)
      flash[:success] = ["Changes saved!"]

      redirect_to photo_url(@photo)
    else
      flash.now[:errors] = @photo.errors.full_messages

      render :edit
    end
  end

  def destroy
    @photo = current_user.photos.find(params[:id])
    if @photo.nil?
      flash[:errors] = ["Unabe to destroy a photo that doesn't exist or doesn't belong to you."]
      redirect_to root_url
      return
    end

    @photo.destroy
    flash[:success] = ["#{@photo.title} successfully deleted."]

    redirect_to user_url(current_user)
  end

  def map
    @photos = Photo.where("latitude IS NOT NULL AND longitude IS NOT NULL")

    # render json: @photos
    render :map
  end

  def recent
    @photos = Photo.order_home.limit(5)

    render :recent
  end

  def top
    @loved = Photo.most_loved

    render :top
  end

  def random
    @photo = Photo.all.shuffle.first
    
    redirect_to photo_url(@photo)
  end

  def tile
    @photo = Photo.find(params[:id])
    render :tile, layout: false
  end

  private
  def photo_params
    params.require(:photo).permit(:title, :description, :image, :location)
  end
end
