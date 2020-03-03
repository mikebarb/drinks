class AddLastdrinkidToPerson < ActiveRecord::Migration[5.0]
  def change
    add_column :people, :lastdrinkid, :integer
    add_column :people, :lastdrinktime, :datetime
  end
end
