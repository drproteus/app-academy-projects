json.photos @photos do |photo|
  json.extract! photo, :id, :title
  json.url photo.image.url(:medium)
end

json.page @page
json.total_pages @total_pages