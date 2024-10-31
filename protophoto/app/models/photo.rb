class Photo < ActiveRecord::Base
  include OrderQuery
  include PgSearch

  validates :owner, :image, presence: true

  has_attached_file :image, styles: { large: "800x800>",
                                      medium: "300x300#", 
                                      thumb: "100x100#" }
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/
  before_validation :ensure_title

  after_post_process :save_exif

  geocoded_by :location
  reverse_geocoded_by :latitude, :longitude, address: :location
  after_validation :reverse_geocode, :geocode

  belongs_to :owner,
    class_name: "User",
    foreign_key: :user_id,
    primary_key: :id,
    inverse_of: :photos

  has_many :comments, as: :commentable, dependent: :destroy

  has_many :album_memberships,
    class_name: "AlbumMembership",
    foreign_key: :photo_id,
    primary_key: :id,
    inverse_of: :photo

  has_many :albums,
    through: :album_memberships,
    source: :album

  has_many :favorites,
    class_name: "Favorite",
    foreign_key: :photo_id,
    primary_key: :id,
    inverse_of: :photo,
    dependent: :destroy

  has_many :taggings,
    class_name: "Tagging",
    foreign_key: :photo_id,
    primary_key: :id,
    inverse_of: :photo,
    dependent: :destroy

  has_many :tags,
    through: :taggings,
    source: :tag

  order_query :order_home,
    [:created_at, :desc]

  def Photo.search_params
    [:title, :description, :make, :model, :location]
  end
  pg_search_scope :search, 
    against: Photo.search_params,
    using: { tsearch: {prefix: true} }

  pg_search_scope :tag_search, 
    associated_against: { tags: [:name] }

  def Photo.most_loved
    sql = <<-SQL
      SELECT photos.*
      FROM photos
      INNER JOIN favorites ON
      favorites.photo_id = photos.id
      GROUP BY
      photos.id
      ORDER BY
      COUNT(favorites.id) DESC
      LIMIT
      5
    SQL

    Photo.find_by_sql(sql)
  end

  def ensure_title
    if self.title.blank?
      self.title = self.image_file_name
    end
  end

  def info
    compiled = {}
    compiled["Location"] = self.location unless self.location.blank?
    candidate_fields = [:taken_at, :make, :model, :aperture,
                        :focal_length, :exposure_time, :iso, :flash]
    candidate_fields.each do |field|
      if value = self.send(field)
        compiled[field.to_s.gsub("_", " ").capitalize] = value
      end
    end

    compiled
  end


  private
  def save_exif
    exif_data = MiniExiftool.new(image.queued_for_write[:original].path)
    self.make = exif_data.make
    self.model = exif_data.model
    self.aperture = exif_data.aperture
    self.focal_length = exif_data.focal_length
    self.exposure_time = exif_data.exposure_time
    self.iso = exif_data.iso
    self.flash = exif_data.flash
    self.latitude = parse_latlong(exif_data.gpslatitude)
    self.longitude = parse_latlong(exif_data.gpslongitude)
    self.taken_at = exif_data.createdate
  end

  # Thank you, Brooks Swinnerton from General Assembly for the following!
  # http://listenin.gs/2014/07/18/using-miniexiftool-with-paperclip/
  def parse_latlong(latlong)
    return unless latlong
    match, degrees, minutes, seconds, rotation = /(\d+) deg (\d+)' (.*)" (\w)/.match(latlong).to_a
    calculate_latlong(degrees, minutes, seconds, rotation)  
  end

  def calculate_latlong(degrees, minutes, seconds, rotation)
    calculated_latlong = degrees.to_f + minutes.to_f/60 + seconds.to_f/3600
    ['S', 'W'].include?(rotation) ? -calculated_latlong : calculated_latlong
  end
end
