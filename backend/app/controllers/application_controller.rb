class ApplicationController < ActionController::API
  include ActionController::Cookies

  # def authenticate_user!
  #   unless current_user
  #     render json: { error: 'You must be logged in' }, status: :unauthorized
  #   end
  # end

  private

  def current_user
    return unless session[:current_user_id]

    @_current_user ||= session[:current_user_id] && User.find_by(id: session[:current_user_id])
  end
end
