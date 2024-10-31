class Api::CommentsController < ApplicationController
  def destroy
    @comment = current_user.authored_comments.find(params[:id])
    @comment.destroy
    render json: {}
  end

  def create
    @comment = current_user.authored_comments.new(comment_params)
    if @comment.save
      render :show
    else
      render json: {}, status: :unprocessable_entity
    end
  end

  def show
    @comment = Comment.find(params[:id])
  end

  private
  def comment_params
    params.require(:comment).permit(:commentable_type, :commentable_id, :content)
  end
end