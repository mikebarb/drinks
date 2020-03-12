class AddLastdrinkToPeople < ActiveRecord::Migration[5.0]
  def change
    add_column :people, :lastdrink, :string
  end
end
