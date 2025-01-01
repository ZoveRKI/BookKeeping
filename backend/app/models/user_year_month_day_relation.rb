class UserYearMonthDayRelation < ApplicationRecord
  belongs_to :user
  belongs_to :year_month

  validates :day, presence: true, inclusion: { in: 1..31 }
end
