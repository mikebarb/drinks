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
    logger.debug "@order: " + @order.inspect

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


  # PATCH/PUT /orders/1
  # PATCH/PUT /orders/1.json
  def update
    respond_to do |format|
      if @order.update(order_params)
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
      params.require(:order).permit(:person_id, :drink_id, :quantity, :status, :day)
    end
    
    # Never trust parameters from the scary internet, only allow the white list through.
    def person_params
      params.require(:person).permit(:id, :name)
    end
end
