class User < ActiveRecord::Base
  include PgSearch

  validates :email, :password_digest, presence: true
  validates :email, uniqueness: true, length: { maximum: 254 }
  validates_format_of :email, with: /@/
  validates :password, confirmation: true, length: { minimum:  6, }, allow_nil: true
  validates :password_confirmation, presence: true, if: :password
  after_initialize :ensure_session_token

  has_attached_file :avatar, styles: { medium: "300x300>",
                                       icon: "100x100#",
                                       icon_small: "50x50#",
                                       icon_tiny: "24x24#" },
                             default_url: ":style/missing.png"
  validates_attachment_content_type :avatar, content_type: ['image/png', 'image/jpg', 'image/jpeg']

  has_many :photos,
    class_name: "Photo",
    foreign_key: :user_id,
    primary_key: :id,
    inverse_of: :owner,
    dependent: :destroy

  has_many :authored_comments,
    class_name: "Comment",
    foreign_key: :user_id,
    primary_key: :id,
    inverse_of: :author,
    dependent: :destroy

  has_many :albums,
    class_name: "Album",
    foreign_key: :user_id,
    primary_key: :id,
    inverse_of: :owner,
    dependent: :destroy

  has_many :favorites,
    class_name: "Favorite",
    foreign_key: :user_id,
    primary_key: :id,
    inverse_of: :user,
    dependent: :destroy

  has_many :favorite_photos,
    through: :favorites,
    source: :photo

  has_many :taggings,
    class_name: "Tagging",
    foreign_key: :user_id,
    primary_key: :id,
    inverse_of: :owner

  has_many :comments, as: :commentable

  has_many :authored_messages,
    class_name: "Message",
    foreign_key: :from_id,
    primary_key: :id,
    inverse_of: :author

  has_many :received_messages,
    class_name: "Message",
    foreign_key: :to_id,
    primary_key: :id,
    inverse_of: :recipient

  pg_search_scope :search, 
    against: [:email],
    using: { tsearch: {prefix: true} }

  attr_reader :password

  def User.generate_session_token
    SecureRandom.urlsafe_base64(32)
  end

  def User.find_by_credentials(email, password)
    user = User.find_by(email: email)
    if user && user.is_password?(password)
      return user
    end

    nil
  end

  def password=(password)
    return if password.blank? && self.password_digest.present?
    @password ||= password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def ensure_session_token
    self.session_token ||= User.generate_session_token
  end

  def reset_session_token!
    self.session_token = User.generate_session_token
    self.save!
    self.session_token
  end

  def url=(url)
    return if url.blank?
    begin
      self.avatar = URI.parse(url)
    rescue Exception
      return nil
    end
  end

  def unread_message_count
    self.received_messages.where(viewed: false).count
  end
end
