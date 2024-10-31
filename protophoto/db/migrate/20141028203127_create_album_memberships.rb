class CreateAlbumMemberships < ActiveRecord::Migration
  def change
    create_table :album_memberships do |t|
      t.integer :album_id, null: false
      t.integer :photo_id, null: false
      
      t.timestamps
    end
  end
end
