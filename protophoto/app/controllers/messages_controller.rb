class MessagesController < ApplicationController
  before_filter :ensure_logged_in

  def new
    @recipient = User.find(params[:user_id])
    @response_subject = params[:re]

    render :new
  end

  def create
    @message = current_user.authored_messages.new(message_params)

    if @message.save
      redirect_to user_url(@message.to_id)
    else
      flash.now[:errors] = @message.errors.full_messages
      @to_id = @message.to_id

      render :new
    end
  end

  def show
    @message = current_user.received_messages.find(params[:id])
    @author = User.find(@message.from_id)
    @message.viewed = true
    @message.save!

    render :show
  end

  def index
    @received_messages = current_user.received_messages.order("created_at desc")

    render :index
  end

  def destroy
    @message = current_user.received_messages.find(params[:id])
    @message.destroy
    redirect_to messages_url
  end

  private
  def message_params
    params.require(:message).permit(:to_id, :subject, :body)
  end 
end
