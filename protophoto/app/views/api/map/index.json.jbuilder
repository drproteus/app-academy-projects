json.array! @photos do |photo|
  json.type "Feature"
  json.geometry do
    json.type "Point"
    json.coordinates [photo.longitude, photo.latitude]
  end
  json.properties do
    json.title photo.title
    json.url photo_url(photo.id)
    json.icon do
      json.iconUrl photo.image.url(:thumb)
      json.iconSize [100, 100]
      json.iconAnchor [50, 50]
      json.popupAnchor [0, -50]
      json.className "dot"
    end
  end
end