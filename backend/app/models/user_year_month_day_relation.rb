class UserYearMonthDayRelation < ApplicationRecord
  belongs_to :user
  belongs_to :year_month
  has_one :daily_expense
  has_many :additional_expenses, dependent: :destroy

  validates :day, presence: true, inclusion: { in: 1..31 }

  validates_uniqueness_of :user_id, scope: :year_month_id
end
