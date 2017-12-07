json.extract! order, :id, :person_id, :drink_id, :quantity, :status, :day, :created_at, :updated_at
json.url order_url(order, format: :json)
