class AddDrinkToOrders < ActiveRecord::Migration[5.0]
  def change
    add_column :orders, :drink, :string
  end
end
