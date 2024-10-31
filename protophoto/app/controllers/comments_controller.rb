class CommentsController < ApplicationController
  def create
    @comment = Comment.new(comment_params)
    @comment.user_id = current_user.id

    if @comment.save
      redirect_to eval("#{comment_params[:commentable_type].downcase}_url(#{comment_params[:commentable_id]})")
    else
      flash.now[:errors] = @comment.errors.full_messages

      redirect_to eval("#{comment_params[:commentable_type].downcase}_url(#{comment_params[:commentable_id]})")
    end
  end

  def destroy
    @comment = current_user.authored_comments.find(params[:id])
    @comment.destroy
    redirect_to eval("#{@comment.commentable_type.downcase}_url(#{@comment.commentable_id})")
  end

  private
  def comment_params
    params.require(:comment).permit(:commentable_id, :commentable_type, :content)
  end
end
