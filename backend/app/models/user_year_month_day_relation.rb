class UserYearMonthDayRelation < ApplicationRecord
  belongs_to :user
  belongs_to :year_month

  validates :year, presence: true
  validates :month, presence: true, inclusion: { in: 1..12 }
  validates :day, presence: true, inclusion: { in: 1..31 }
end
