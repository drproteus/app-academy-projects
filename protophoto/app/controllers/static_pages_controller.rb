class StaticPagesController < ApplicationController
  before_filter :push_to_site_proper, only: [:landing]

  def index
    @all_photos = Photo.all

    render :index
  end

  def landing
    render :landing
  end

  def push_to_site_proper
    redirect_to "/photos/recent" if logged_in?
  end
end
