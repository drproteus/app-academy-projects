class SessionController < ApplicationController
  before_filter :ensure_logged_in, only: :destroy
  before_filter :registered_filter, only: [:new, :create]
  
  def new
    @user = User.new
    render :new
  end

  def create
    @user = User.find_by_credentials(user_params[:email],
                                     user_params[:password])
    if @user.nil? && user_params[:email] == "demo@de.mo"
      @user = User.find_by(email: "demo@de.mo")
    end
    
    if @user
      login!(@user)

      redirect_to user_url(current_user)
    else
      flash.now[:errors] = ["Invalid credentials!"]
      render :new
    end
  end

  def destroy
    logout!

    redirect_to root_url
  end

  private
  def user_params
    params.require(:user).permit(:email, :password)
  end
end
