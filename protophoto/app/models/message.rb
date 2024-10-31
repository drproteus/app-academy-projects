class Message < ActiveRecord::Base
  before_validation :ensure_subject

  belongs_to :author,
    class_name: "User",
    foreign_key: :from_id,
    primary_key: :id,
    inverse_of: :authored_messages

  belongs_to :recipient,
    class_name: "User",
    foreign_key: :to_id,
    primary_key: :id,
    inverse_of: :received_messages

  def ensure_subject
    if self.subject.blank?
      self.subject = "No Subject"
    end
  end
end
