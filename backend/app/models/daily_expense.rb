class DailyExpense < ApplicationRecord
  belongs_to :user_year_month_day_relation

  validates :expense, presence: true, numericality: { greater_than_or_equal_to: 0 }

  validates_uniqueness_of :user_year_month_day_relation_id
end
