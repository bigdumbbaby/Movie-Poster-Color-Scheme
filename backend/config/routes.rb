Rails.application.routes.draw do
  resources :uploads
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :movies, only: [:index, :show]
  get '/search', to: 'movies#search'
end
