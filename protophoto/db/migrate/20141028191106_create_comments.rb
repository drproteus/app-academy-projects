class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.integer :photo_id, null: false
      t.integer :user_id, null: false
      t.text :content, null: false

      t.timestamps
    end
  end
end
