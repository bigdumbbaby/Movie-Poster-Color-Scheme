class CreateUploads < ActiveRecord::Migration[6.1]
  def change
    create_table :uploads do |t|
      t.string :url
      t.string :palette_number

      t.timestamps
    end
  end
end
