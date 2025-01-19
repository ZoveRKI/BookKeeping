class MonthlyExpenseDetail < ApplicationRecord
  belongs_to :user
  belongs_to :year_month

  validates :average_daily_expense, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :total_monthly_expense, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :predict_total_monthly_expense, presence: true, numericality: { greater_than_or_equal_to: 0 }

  validates :user_id, uniqueness: {
    scope: [
      :year_month_id,
      :average_daily_expense,
      :total_monthly_expense,
      :predict_total_monthly_expense
    ],
    message: "Combination of user, year-month, and expense details must be unique"
  }
end
