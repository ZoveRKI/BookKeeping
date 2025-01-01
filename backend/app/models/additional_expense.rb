class AdditionalExpense < ApplicationRecord
  belongs_to :user_year_month_day_relation

  validates :additional_expense, presence: true, numericality: { greater_than_or_equal_to: 0 }
end
