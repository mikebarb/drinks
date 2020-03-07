class CreateOrders < ActiveRecord::Migration[5.0]
  def change
    create_table :orders do |t|
      # t.belongs_to :person, foreign_key: true
      # t.belongs_to :drink, foreign_key: true
      t.references :person
      t.references :drink
      t.integer :quantity
      t.string :status
      t.date :day

      t.timestamps
    end
    add_index :orders, :day
    
    add_foreign_key :orders, :people, column: :person_id
    add_foreign_key :orders, :drinks, column: :drink_id
    
  end
end
