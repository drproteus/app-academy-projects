class UsersController < ApplicationController
  before_filter :ensure_logged_in, only: [:index]
  before_filter :registered_filter, only: [:new, :create]
  
  def new
    @user = User.new
    render :new
  end

  def create
    @user = User.new(user_params)
    # @user.avatar = params[:user][:avatar]
    
    if @user.save
      login!(@user)
      flash[:success] = ["Thanks for signing up, #{@user.email}"]
      redirect_to user_url(current_user)
    else
      flash.now[:errors] = @user.errors.full_messages
      render :new
    end
  end

  def show
    @user = User.find(params[:id])
    @photos = @user.photos.order_home.page(params[:photo_page]).per(9)
    @albums = @user.albums.page(params[:album_page]).per(8)

    render :show
  end

  def index
    @users = User.page(params[:page]).per(20).order("created_at asc")

    render :index
  end

  def edit
    render :edit
  end

  def update
    @user = current_user
    if @user.update(user_params)
      redirect_to user_url(current_user)
    else
      flash.now[:errors] = @user.errors.full_messages

      render :edit
    end
  end

  def destroy
    if @user = User.find_by(email: "demo@de.mo")
      flash[:errors] = ["Please don't delete the demo!"]
      redirect_to root_url
      return
    end

    @user = User.find(params[:id])
    if @user == current_user
      @user.destroy
      flash[:success] = ["Goodbye. We will miss you."]

      redirect_to root_url
    else
      flash[:errors] = ["You best check yourself, lest you wreck yourself."]

      redirect_to root_url
    end
  end

  private
  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :avatar, :url, :bio)
  end
end
