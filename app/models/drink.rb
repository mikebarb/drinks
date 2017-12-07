class Drink < ApplicationRecord
    has_many :orders
    has_many :people, through: :orders
end
