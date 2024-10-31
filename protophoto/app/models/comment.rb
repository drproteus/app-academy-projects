class Comment < ActiveRecord::Base
  validates :author, :commentable_id, :content, presence: true
  
  belongs_to :author,
    class_name: "User",
    foreign_key: :user_id,
    primary_key: :id,
    inverse_of: :authored_comments

  belongs_to :commentable, polymorphic: true
end
