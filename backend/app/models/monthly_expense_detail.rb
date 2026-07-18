class MonthlyExpenseDetail < ApplicationRecord
  belongs_to :user_year_month

  validates :average_daily_expense, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :total_monthly_expense, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :predict_total_monthly_expense, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :user_year_month_id, uniqueness: true
end
