class Person < ApplicationRecord
    has_many :orders, dependent: :destroy
    has_many :drinks, through: :orders
    
    #before_destroy :ensure_not_referenced_by_orders
    
    #private
    #    #ensure that there are no order items relating to this person
    #    def ensure_not_referenced_by_orders
    #        unless orders.empty?
    #            errors.add(:base, 'Orders persent for this person')
    #            throw :abort
    #        end
    #    end
end
