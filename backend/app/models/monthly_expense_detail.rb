class MonthlyExpenseDetail < ApplicationRecord
  belongs_to :user
  belongs_to :year_month

  validates :average_daily_expense, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :total_monthly_expense, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :predict_total_monthly_expense, presence: true, numericality: { greater_than_or_equal_to: 0 }

  validates_uniqueness_of :user_id, scope: :year_month_id
end
