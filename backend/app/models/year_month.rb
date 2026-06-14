class YearMonth < ApplicationRecord
  has_many :user_year_months, dependent: :destroy
  has_many :user_year_month_day_relations, dependent: :destroy
  has_many :monthly_expense_details, dependent: :destroy

  validates :year, presence: true, numericality: { only_integer: true }
  validates :month, presence: true, inclusion: { in: 1..12 }

  validates_uniqueness_of :year, scope: :month
end
