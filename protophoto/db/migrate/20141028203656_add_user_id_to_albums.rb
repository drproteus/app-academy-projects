class AddUserIdToAlbums < ActiveRecord::Migration
  def change
    add_column :albums, :user_id, :integer
    change_column :albums, :user_id, :integer, null: false
  end
end
