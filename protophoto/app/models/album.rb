class Album < ActiveRecord::Base
  include PgSearch

  validates :title, :owner, presence: true

  belongs_to :owner,
    class_name: "User",
    foreign_key: :user_id,
    primary_key: :id,
    inverse_of: :albums

  has_many :album_memberships,
    class_name: "AlbumMembership",
    foreign_key: :album_id,
    primary_key: :id,
    inverse_of: :album

  has_many :photos,
    through: :album_memberships,
    source: :photo

  pg_search_scope :search,
    against: [:title, :description],
    using: { tsearch: { prefix: true } }
end
