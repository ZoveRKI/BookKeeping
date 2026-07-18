class YearMonth < ApplicationRecord
  has_many :user_year_months, dependent: :destroy
  has_many :user_year_month_day_relations, through: :user_year_months
  has_many :monthly_expense_details, through: :user_year_months

  validates :year, presence: true, numericality: { only_integer: true }
  validates :month, presence: true, inclusion: { in: 1..12 }

  validates_uniqueness_of :year, scope: :month
end
