class UploadsController < ApplicationController

  def index 
    @uploads = Upload.all 
    render json: @uploads
  end
  
  def show
    @upload = Upload.find(params[:id])

    render json: @upload
  end

  def create 
    @upload = Upload.new(upload_params)

    if @upload.valid? 
      @upload.save 
      render json: @upload, status: :created
    else
      render json: {errors: @upload.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @upload = Upload.find(params[:id])
    @upload.destroy
    render json: {'message': 'Upload deleted.'}
  end

  private

  def upload_params
    params
    .permit(:url, :palette_number)
  end
end
