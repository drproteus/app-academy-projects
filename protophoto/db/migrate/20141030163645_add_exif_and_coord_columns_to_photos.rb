class AddExifAndCoordColumnsToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :latitude, :float
    add_column :photos, :longitude, :float
    add_column :photos, :make, :string
    add_column :photos, :model, :string
    add_column :photos, :focal_length, :string
    add_column :photos, :exposure_time, :string
    add_column :photos, :iso, :string
    add_column :photos, :flash, :string
  end
end
