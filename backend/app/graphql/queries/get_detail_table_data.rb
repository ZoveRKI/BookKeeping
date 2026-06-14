module Queries
  class GetDetailTableData < BaseQuery
    type Types::GetDetailTableDataType, null: false
    argument :year_month_id, ID, required: true

    def resolve(year_month_id:)
      user = context[:current_user]

      monthly_expense_detail = MonthlyExpenseDetail.find_by(user_id: user.id, year_month_id: year_month_id)

      recorded_date = UserYearMonthDayRelation
        .joins(:daily_expense)
        .where(user_id: user.id, year_month_id: year_month_id)
        .count

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
