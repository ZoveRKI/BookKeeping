module Types
  class GetDetailTableDataType < Types::BaseObject
    field :recorded_date, Int, null: true
    field :total_monthly_expense, Float, null: true
    field :average_daily_expense, Float, null: true
    field :predict_total_monthly_expense, Float, null: true
  end
end
