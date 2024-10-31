Rails.application.routes.draw do
  root to: "static_pages#landing"
  resources :users, only: [:new, :create, :show, :edit, 
                           :update, :index, :destroy] do
    resources :messages, only: [:new]
  end
  resources :session, only: [:new, :create, :destroy]

  get '/photos/recent', to: "photos#recent"
  get '/photos/top', to: "photos#top"
  get '/photos/map', to: "photos#map"
  get '/photos/random', to: "photos#random"
  get '/photos/:id/tile', to: "photos#tile"
  get '/about', to: "static_pages#about"
  get '/landing', to: "static_pages#landing"

  resources :photos, only: [:new, :create, :show, :index, 
                            :edit, :update, :destroy] do
    resources :favorites, only: [:create]
  end

  resources :comments, only: [:create, :destroy]
  resources :albums, only: [:new, :create, :show, :edit, :update, :destroy]
  resources :favorites, only: [:index, :destroy]
  resources :tags, only: [:show, :index]
  resources :taggings, only: [:create, :destroy]
  resources :messages, only: [:create, :show, :index, :destroy]

  resources :album_memberships, only: [:create]

  resources :search, only: [:index]

  namespace :api, defaults: { format: 'json' } do
    get 'photos/recent', only: [:index], format: :json
    get 'photos/loved', only: [:index], format: :json
    resources :photos, only: [:index, :show], format: :json
    resources :taggings, only: [:destroy, :create]
    resources :tags, only: [:show]
    resources :map, only: [:index]
    resources :comments, only: [:create, :destroy, :show]
  end
end
