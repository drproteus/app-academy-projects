class RemoveNullConstraintsFromAlbumMemberships < ActiveRecord::Migration
  def change
    change_column :album_memberships, :album_id, :integer, null: true
    change_column :album_memberships, :photo_id, :integer, null: true
  end
end
