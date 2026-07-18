class User < ApplicationRecord
  has_many :user_year_months, dependent: :destroy
  has_many :user_year_month_day_relations, through: :user_year_months
  has_many :monthly_expense_details, through: :user_year_months

  has_secure_password

  validates :user_name, presence: true
  validates :password, presence: true
end
