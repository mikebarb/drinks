class OrdersController < ApplicationController
  before_action :set_order, only: [:show, :edit, :update, :destroy]

  # GET /orders
  # GET /orders.json
  def index
    @orders = Order.all
  end

  # GET /orders/1
  # GET /orders/1.json
  def show
  end

  # GET /orders/new
  def new
    @order = Order.new
    logger.debug "@order: " + @order.inspect
    logger.debug "params: " + params.inspect
    @order.person_id = params[:person_id]
    @order.quantity = 1
    @order.day = Date.today
    @order.status = 'new'
    logger.debug "@order: " + @order.inspect
    
    @person = Person.find(params[:person_id])
    logger.debug "@person: " + @person.inspect
    
    @drinks = Drink.all
    logger.debug "@drinks: " + @drinks.inspect
  end

  # GET /orders/1/edit
  def edit
  end

  # POST /orders
  # POST /orders.json
  def create
    @order = Order.new(order_params)

    respond_to do |format|
      if @order.save
        format.html { redirect_to people_path, notice: 'Order was successfully created.' }
        format.json { render :show, status: :created, location: @order }
      else
        format.html { render :index }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  #--------------------------------------------------------
  # added for the counter submitting orders ajax feature
  # post provides minimal info, rest added here by default
  #--------------------------------------------------------
  # POST /ordersubmit
  # POST /ordersubmit.json
  def submit
    @order = Order.new(order_params)
    logger.debug "params: " + params.inspect
    @order.quantity = 1
    @order.day = Date.today
    @order.status = 'new'
    @drink = @order.drink
    logger.debug "@order: " + @order.inspect

    respond_to do |format|
      if @order.save
        @person = Person.find(@order.person_id)
        @person.lastdrink = @order.drink
        @person.lastdrinktime = Time.now
        logger.debug "Just before save @person: " + @person.inspect
        @person.save
        #@drink = Drink.find(@order.drink)
        ActionCable.server.broadcast("neworder_channel", message: [@order, @person.name, @drink])
        format.html { redirect_to people_path, notice: 'Order was successfully created.' }
        format.json { render :show, status: :created, location: @order }
      else
        format.html { render :index }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end


  # PATCH/PUT /orders/1
  # PATCH/PUT /orders/1.json
  def update
    respond_to do |format|
      myOrderId = params[:id]
      #logger.debug "myOrderId: " + myOrderId
      myUpdateFields = {}
      myUpdateFields = order_params
      myChangedFields = {}
      person_name = drink_name = ""
      #logger.debug "myUpdateFields: " + myUpdateFields.inspect
      day_db = @order.day
      #logger.debug "day_db: " + day_db.inspect
      if (myUpdateFields["day(1i)"]) then
        #logger.debug "there is a day field requested in the update parameters"
        day_update = Date.new myUpdateFields["day(1i)"].to_i, myUpdateFields["day(2i)"].to_i, myUpdateFields["day(3i)"].to_i
        #logger.debug "day_update: " + day_update.inspect
        if(day_update) then   # is it even present in requested updates
          #logger.debug "day change requested"
          if (day_db != day_update) then   # detect if it actually changed
            myChangedFields["day"] = day_update        
          end
        end
      end
      #logger.debug "myChangedFields: " + myChangedFields.inspect
      #logger.debug "****************** "
      myUpdateFields.each {|k,v| 
        #logger.debug k + ": " + v.inspect + " db value: " + @order[k].inspect
        #my_string.include? "cde"
        if (k.include? "day" ) then
          #logger.debug "day is found"
          #day_db = @order.day
          #date = Date.new event["date(1i)"].to_i, event["date(2i)"].to_i, event["date(3i)"].to_i
          #day_update = Date.new myUpdateFields["day(1i)"].to_i, myUpdateFields["day(1i)"].to_i, myUpdateFields["day(1i)"].to_i
          next
        end
        #logger.debug "just after the detecting day processing"
        if (@order[k].to_s != v.to_s) then
          myChangedFields[k] = v
          if (k == "person_id") then
            #logger.debug "this will need to get the name of the person"
            person_name = Person.find(v).name
            #logger.debug "person_name: " + person_name
          end
          if (k == "drink_id") then
            #logger.debug "this will need to get the name of the drink"
            drink_name = Drink.find(v).name
            #logger.debug "drink_name: " + drink_name
          end
        end
      }
      #logger.debug "myChangedFields: " + myChangedFields.inspect
      if @order.update(order_params)
        ActionCable.server.broadcast("updateorder_channel", 
                    message: [myOrderId, myChangedFields, person_name, drink_name])
        format.html { redirect_to shop_orders_path, notice: 'Order was successfully updated.' }
        format.json { render :show, status: :ok, location: @order }
      else
        format.html { render :edit }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /orders/1
  # DELETE /orders/1.json
  def destroy
    @order.destroy
    respond_to do |format|
      ActionCable.server.broadcast("destroyorder_channel", message: @order.id) 
      #ActionCable.server.broadcast("updateorder_channel", 
      #              message: [myOrderId, myChangedFields, person_name, drink_name])
      format.html { redirect_to orders_url, notice: 'Order was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_order
      @order = Order.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def order_params
      params.require(:order).permit(:person_id, :drink_id, :quantity, :status, :day, :drink)
    end
    
    # Never trust parameters from the scary internet, only allow the white list through.
    def person_params
      params.require(:person).permit(:id, :name)
    end
end
