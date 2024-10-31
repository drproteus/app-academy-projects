json.(@photo, :id, :title, :description, :image_file_name, :created_at, :updated_at, :user_id, :info)

json.owner @photo.owner, :id, :email, :avatar_file_name

json.albums @photo.albums do |album|
  json.extract! album, :id, :title, :description
end

json.tags @photo.tags do |tag|
  json.extract! tag, :id, :name
end

json.favorites @photo.favorites do |favorite|
  json.extract! favorite, :user_id
end

json.comments @photo.comments do |comment|
  json.extract! comment, :user_id, :content
end

json.next_photo_id @next.id
json.prev_photo_id @prev.id

