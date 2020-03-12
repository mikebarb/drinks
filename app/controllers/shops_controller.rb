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
              .includes(:person)
              .order(:id)
              .reverse_order
#              .where("status != ?", "done")

 
    logger.debug "@orders: " + @orders.inspect
    
    @statusList = Order
              .select(:status)
              .distinct
    logger.debug "@statusList: " + @statusList.inspect
  end

  # GET /shops/ready
  # GET /shops/ready.json
  def ready
    @orders = Order
              .where("status != ?", "done")
              .includes(:person)
              .order(:id)
 
    logger.debug "@orders: " + @orders.inspect
    
    @statusList = ["ready"]
    logger.debug "@statusList: " + @statusList.inspect
  end

  # GET /shops/new
  # GET /shops/new.json
  def new
    @orders = Order
              .where('updated_at > ?', 24.hours.ago)
              .includes(:person)
              .order(:id)

  #            .where("status != ?", "done")

    logger.debug "@orders: " + @orders.inspect

    @drinks = Drink.all
    logger.debug "@drinks: " + @drinks.inspect

    @orderscount = Order.group(:drink).count
              #.where("status == ?", "new")
              #.includes(:drink)
    logger.debug "@orderscount" + @orderscount.inspect

    #@statusList = Order
    #          .select(:status)
    #          .distinct
    @statusList = ["new", "ready", "done"]
    logger.debug "@statusList: " + @statusList.inspect
  end
  
  # GET /shops/print
  # GET /shops/print.json
  def print
    # this controller simply triggers a simple page 
    # used for printing lables.
    # This page listens for and processes websocket streamed info.
    logger.debug "-----------------------------------------------------"
    logger.debug "entering shops controller"
    logger.debug "parms: " + params.inspect
    #logger.debug "-----------------------------------------------------"
    # Store in session parametes stuff that needs to be kept.
    count = session[:count] || 0
    count += 1
    session[:count] = count
    logger.debug "count: " + count.inspect
    client_id = "269084671189-flp3v3aoifa6apfio4mcgh16ck3sq909.apps.googleusercontent.com"
    client_secret = "cyHu8PqkWpgc0TsClH1fHkcw"
    client_redirect_url = "https://drinks-micmac.c9users.io/shops/print"
    printer_id = '148e56bc-0d7a-642b-9ce3-ba973c3244e9'
    mycode = params[:code]
    logger.debug "mycode: " + mycode.inspect
    myfileName = "tmp/printobject.txt"
    logger.debug "load client from file - first load - occurs if file exists"
    if File::exist?(myfileName) then
        myfile = File.new(myfileName, "r")
        client = Marshal.load(myfile)
        logger.debug "client reloaded: " + client.inspect
        myfile.close
    end
    if(!client) then
      client = CloudPrint::Client.new(client_id: client_id,
                                    client_secret: client_secret
                                    #refresh_token: '4/AWhSyX8Wp4Fasyb66P2AmpCu4ftYZOrzDGqlcLQV70M'
                                    #access_token: 'ya29.GlsiBZhJQxEXzOJYDB4rghj2Jh7az_3marTOrDcI7otsNykHr9YoE38QljaZrU_2KiZOcOb33YBIxv9zL8XJs4MRuWYgfZMQniptY4Rc8woLBE7HD_AXARsmfmia'
                                    )
      @authorize_url = client.auth.generate_url(client_redirect_url)
      logger.debug "0-client: " + client.inspect
      logger.debug "@authorize_url: " + @authorize_url.inspect
      logger.debug "-----------------------------------------------------"
      logger.debug "dumped client to file - no initial file"
      myfile = File.new(myfileName, "w")
      Marshal.dump(client, myfile)
      myfile.close
      logger.debug "About to call render!!! - user will need to authorize the printer"
      render :print and return
    end
    if (mycode) then
      logger.debug "-------------------------- in mycode --------------"
      #if File::exist?(myfileName) then
      #  myfile = File.new(myfileName, "r")
      #  client = Marshal.load(myfile)
      #  logger.debug "client reloaded: " + client.inspect
      #  myfile.close
      #end
      logger.debug "3-client: " + client.inspect
      begin
        refresh_token = client.auth.generate_token(mycode, client_redirect_url)
      rescue
        flash[:notice] = "error processing client.auth.generate_token." 
        # assume that if there is no token && there has been no code in the
        # parameters, then we need to start from scratch building the client
        # and getting the authorisation code.
        client = CloudPrint::Client.new(client_id: client_id,
                                    client_secret: client_secret
                                    #refresh_token: '4/AWhSyX8Wp4Fasyb66P2AmpCu4ftYZOrzDGqlcLQV70M'
                                    #access_token: 'ya29.GlsiBZhJQxEXzOJYDB4rghj2Jh7az_3marTOrDcI7otsNykHr9YoE38QljaZrU_2KiZOcOb33YBIxv9zL8XJs4MRuWYgfZMQniptY4Rc8woLBE7HD_AXARsmfmia'
                                    )
        logger.debug "1-client: " + client.inspect
        logger.debug "-----------------------------------------------------"
        @authorize_url = client.auth.generate_url(client_redirect_url)
        logger.debug "@authorize_url: " + @authorize_url.inspect
        logger.debug "2-client: " + client.inspect
        logger.debug "dumped client to file - initial no code block"
        myfile = File.new(myfileName, "w")
        Marshal.dump(client, myfile)
        myfile.close
        logger.debug "About to call render!!! - user will need to authorize the printer"
        render :print and return
      end
      # If we get here, then we must have a got back a refresh token from the 
      # swap the exchange suthorization code for token call 
      # i.e. client.auth.generate_token.
      logger.debug "refresh_token: " + refresh_token.inspect
      logger.debug "-----------------------------------------------------"
      logger.debug "3a-client: " + client.inspect
      logger.debug "-----------------------------------------------------"
      if (refresh_token) then
        logger.debug "token present - set up client with token for doing print operations"
        client = CloudPrint::Client.new(client_id: client_id,
                                      client_secret: client_secret,
                                      refresh_token: refresh_token
                                      #access_token: 'ya29.GlsiBZhJQxEXzOJYDB4rghj2Jh7az_3marTOrDcI7otsNykHr9YoE38QljaZrU_2KiZOcOb33YBIxv9zL8XJs4MRuWYgfZMQniptY4Rc8woLBE7HD_AXARsmfmia'
                                      )
        myfile = File.new(myfileName, "w")
        Marshal.dump(client, myfile)
        logger.debug "dumped client to file - after creating fresh client with refresh_token"
        myfile.close
        logger.debug "4-client: " + client.inspect
      end
    end
    logger.debug "----------about to search printers-----------------------"
    printers = client.printers.all
    #logger.debug "printers: " + printers.inspect
    printers.each do |p|
      logger.debug "******printer-  id: " + p.id + "   name: " + p.name
      if p.name.downcase.include? "brother"
        printer_id = p.id
      end
    end
    logger.debug "printer_id: " + printer_id.inspect
    
    ###logger.debug "----------about to send a print-----------------------"
    ###my_printer = client.printers.find(printer_id)
    ###logger.debug "myprinter: " + my_printer.inspect
    ###my_printer.print(content: "<h1>This is a test print from the controller</h1>",
    ###                 content_type: "text/html")
  end  
  
end
