module Queries
  class GetDetailTableData < BaseQuery
    type Types::GetDetailTableDataType, null: false
    argument :year_month_id, ID, required: true

    def resolve(year_month_id:)
      user = context[:current_user]

      user_year_month = user.user_year_months.find_by(year_month_id: year_month_id)
      monthly_expense_detail = user_year_month&.monthly_expense_detail

      recorded_date = user_year_month ? user_year_month.user_year_month_day_relations.joins(:daily_expense).count : 0

      if monthly_expense_detail.present?
        {
          recorded_date: recorded_date,
          total_monthly_expense: monthly_expense_detail.total_monthly_expense,
          average_daily_expense: monthly_expense_detail.average_daily_expense,
          predict_total_monthly_expense: monthly_expense_detail.predict_total_monthly_expense
        }
      else
        {
          recorded_date: recorded_date,
          total_monthly_expense: nil,
          average_daily_expense: nil,
          predict_total_monthly_expense: nil
        }
      end
    end
  end
end
