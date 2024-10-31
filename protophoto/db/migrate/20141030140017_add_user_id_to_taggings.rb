class AddUserIdToTaggings < ActiveRecord::Migration
  def change
    add_column :taggings, :user_id, :integer
    change_column :taggings, :user_id, :integer, null: false
  end
end
