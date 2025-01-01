class User < ApplicationRecord
  has_many :user_year_month_day_relations, dependent: :destroy
  has_many :monthly_expense_details, dependent: :destroy

  validates :user_name, presence: true
  validates :password, presence: true
end
