class AddAperatureToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :aperture, :string
  end
end
