class MoviesController < ApplicationController
  def index
    response = JSON.parse(RestClient.get("https://api.themoviedb.org/3/movie/now_playing?api_key=56f6662bff7c2a1c935c2575984e9f97&language=en-US&page=1"))
    render json: response
  end


  def search
    search_name = params[:movie_name].downcase
    page_number = params[:page_number]
    response = JSON.parse(RestClient.get("https://api.themoviedb.org/3/search/movie?api_key=56f6662bff7c2a1c935c2575984e9f97&language=en-US&query=#{search_name}&page=#{page_number}&include_adult=false"))

    render json: response
  end
end
