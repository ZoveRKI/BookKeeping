class UserYearMonth < ApplicationRecord
  belongs_to :user
  belongs_to :year_month

  validates :year_month_id, uniqueness: { scope: :user_id }
end
