class UserYearMonth < ApplicationRecord
  belongs_to :user
  belongs_to :year_month
  has_many :user_year_month_day_relations, dependent: :destroy
  has_one :monthly_expense_detail, dependent: :destroy

  validates :year_month_id, uniqueness: { scope: :user_id }
end
