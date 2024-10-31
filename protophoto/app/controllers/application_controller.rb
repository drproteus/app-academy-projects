class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_user, :logged_in?

  def login!(user)
    session[:session_token] = user.reset_session_token!
  end

  def logout!
    session[:session_token] = nil
  end

  def current_user
    User.find_by(session_token: session[:session_token])
  end

  def logged_in?
    !!current_user
  end

  def parse_tags(tag_string) 
    tag_names = tag_string.split(",").map(&:strip)
    new_taggings = []
    tag_names.each do |tag_name|
      unless tag = Tag.find_by(name: tag_name)
        tag = Tag.new(name: tag_name)
        unless tag.save
          render text: "tag error something happen"
          return
        end
      end
      next if @photo.tags.include?(tag)
      tagging = tag.taggings.new(photo: @photo, user_id: current_user.id)
      unless tagging.save
        render text: "tagging error something happen"
        return
      end
      new_taggings << tagging
    end

    new_taggings
  end

  def ensure_logged_in
    redirect_to new_session_url unless logged_in?
  end

  def registered_filter
    redirect_to root_url if logged_in?
  end
end
