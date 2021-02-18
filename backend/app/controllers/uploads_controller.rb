class UploadsController < ApplicationController

  def index 
    @uploads = Upload.all 

    render json: @uploads
  end

  private

  def uploads_params
    params
    .permit(:url, :palette_number)
  end
end
