class AlbumMembership < ActiveRecord::Base
  validates :album, :photo, presence: true
  validates :photo, uniqueness: { scope: :album }

  belongs_to :album,
    class_name: "Album",
    foreign_key: :album_id,
    primary_key: :id,
    inverse_of: :album_memberships

  belongs_to :photo,
    class_name: "Photo",
    foreign_key: :photo_id,
    primary_key: :id,
    inverse_of: :album_memberships
end
