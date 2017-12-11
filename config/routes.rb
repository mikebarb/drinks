Rails.application.routes.draw do
  # Server websocket cable requests in-process
  #mount ActionCable.server => '/cable'
  
  get 'shops/orders', as: :shop_orders
  get 'shops/counter', as: :shop_counter

  get 'orders/new/:person_id', to: 'orders#new', as: :new_order
  post 'orders/submit', to: 'orders#submit', as: :order_submit
  resources :orders, :except => [:new]
  resources :drinks
  resources :people

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'shops#counter'
  
end
