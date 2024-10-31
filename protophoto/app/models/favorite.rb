class Favorite < ActiveRecord::Base
  validates :user, :photo_id, presence: true
  
  belongs_to :user,
    class_name: "User",
    foreign_key: :user_id,
    primary_key: :id,
    inverse_of: :favorites

  belongs_to :photo,
    class_name: "Photo",
    foreign_key: :photo_id,
    primary_key: :id,
    inverse_of: :favorites
end
