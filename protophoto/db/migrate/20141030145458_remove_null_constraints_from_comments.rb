class RemoveNullConstraintsFromComments < ActiveRecord::Migration
  def change
    change_column :comments, :commentable_id, :integer, null: true
    change_column :comments, :commentable_type, :string, null: true
  end
end
