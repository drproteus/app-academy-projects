class Tagging < ActiveRecord::Base
  validates :tag, :photo, presence: true

  belongs_to :tag,
    class_name: "Tag",
    foreign_key: :tag_id,
    primary_key: :id,
    inverse_of: :taggings

  belongs_to :photo,
    class_name: "Photo",
    foreign_key: :photo_id,
    primary_key: :id,
    inverse_of: :taggings

  belongs_to :owner,
    class_name: "User",
    foreign_key: :user_id,
    primary_key: :id,
    inverse_of: :taggings
end
