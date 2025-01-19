class UserYearMonthDayRelation < ApplicationRecord
  belongs_to :user
  belongs_to :year_month
  has_one :daily_expense
  has_many :additional_expenses, dependent: :destroy

  validates :day, presence: true, inclusion: { in: 1..31 }

  validates :day, uniqueness: {
    scope: [:user_id, :year_month_id],
    message: "Combination of user, year-month, and day must be unique"
  }
end
