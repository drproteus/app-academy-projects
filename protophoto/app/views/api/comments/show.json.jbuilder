json.extract! @comment, :id, :user_id, :content, :created_at, :updated_at, :commentable_type, :commentable_id

json.author_avatar_url @comment.author.avatar.url(:icon_small)
json.author_url user_url(@comment.author)
json.author_email @comment.author.email