class UserYearMonthDayRelation < ApplicationRecord
  belongs_to :user_year_month
  has_one :daily_expense, dependent: :destroy
  has_many :additional_expenses, dependent: :destroy

  validates :day,
    presence: true,
    inclusion: { in: 1..31 },
    uniqueness: {
      scope: :user_year_month_id,
      message: "Combination of user-year-month and day must be unique"
    }
end
