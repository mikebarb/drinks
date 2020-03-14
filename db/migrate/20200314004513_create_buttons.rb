class CreateButtons < ActiveRecord::Migration[5.0]
  def change
    create_table :buttons do |t|
      t.string :name
      t.string :group
      t.string :enable
      t.integer :seq

      t.timestamps
    end
  end
end
