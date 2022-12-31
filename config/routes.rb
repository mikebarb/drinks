Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :buttons
  # Server websocket cable requests in-process
  #mount ActionCable.server => '/cable'
  
  get 'shops/counter', as: :shop_counter
  get 'shops/coffee', as: :shop_coffee
  get 'shops/print', as: :shop_print
  get 'shops/orders', as: :shop_orders
  get 'shops/ready', as: :shop_ready
  get 'shops/check', as: :shop_check
  get 'shops/new', as: :shop_new
  get 'shops/admin', as: :shop_admin 
  get 'orders/new/:person_id', to: 'orders#new', as: :new_order
  post 'orders/submit', to: 'orders#submit', as: :order_submit
  resources :orders, :except => [:new]
  resources :drinks
  resources :people

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'shops#counter'
end
