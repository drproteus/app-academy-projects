class MakeCommentsPolymorphic < ActiveRecord::Migration
  def change
    remove_column :comments, :photo_id
    add_column :comments, :commentable_id, :integer
    add_column :comments, :commentable_type, :string
    change_column :comments, :commentable_id, :integer, null: false
    change_column :comments, :commentable_type, :string, null: false
  end
end
