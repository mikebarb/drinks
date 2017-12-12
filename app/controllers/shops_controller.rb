class ShopsController < ApplicationController
  # GET /shops/counter
  # GET /shops/counter.json
  def counter
    @people = Person.all
    logger.debug "@people: " + @people.inspect
    @drinks = Drink.all
  end

  # GET /shops/orders
  # GET /shops/orders.json
  def orders
    @orders = Order
              .where("status != ?", "completed")
              .includes(:person, :drink)
              .order(:id)
 
    logger.debug "@orders: " + @orders.inspect
    
    @statusList = Order
              .select(:status)
              .where("status != ?", "completed")
              .distinct
    logger.debug "@statusList: " + @statusList.inspect
  end
  
  # GET /shops/print
  # GET /shops/print.json
  def print
    # this controller simply triggers a simply page 
    # used for printing lables
  end  
  
end
