class CreateOrders < ActiveRecord::Migration[5.0]
  def change
    create_table :orders do |t|
      t.belongs_to :person, foreign_key: true
      t.belongs_to :drink, foreign_key: true
      t.integer :quantity
      t.string :status
      t.date :day

      t.timestamps
    end
    add_index :orders, :day
  end
end
