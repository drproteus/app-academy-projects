class Tag < ActiveRecord::Base
  validates :name, null: false
  validates :name, uniqueness: true

  has_many :taggings,
    class_name: "Tagging",
    foreign_key: :tag_id,
    primary_key: :id,
    inverse_of: :tag,
    dependent: :destroy

  has_many :photos,
    through: :taggings,
    source: :photo
end
