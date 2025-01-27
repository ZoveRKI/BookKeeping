module Mutations
  class DeleteRowData < BaseMutation
    argument :user_id, ID, required: true
    argument :year_month_id, ID, required: true
    argument :date, Int, required: true

    field :is_success, Boolean, null: false
    field :message, String, null: true

    def resolve(user_id:, year_month_id:, date:)
      user_year_month_day_relation = UserYearMonthDayRelation.find_by(
        user_id: user_id,
        year_month_id: year_month_id,
        day: date,
      )

      if user_year_month_day_relation&.destroy
        monthly_expense_detail_data = ComputeMonthlyExpenseDetailDataService.new(
          user_id: user_id,
          year_month_id: year_month_id
        ).call

        if monthly_expense_detail_data.present?
          monthly_expense_detail = MonthlyExpenseDetail.find_or_initialize_by(
            user_id: user_id,
            year_month_id: year_month_id,
          )

          monthly_expense_detail.total_monthly_expense = monthly_expense_detail_data[:total_monthly_expense]
          monthly_expense_detail.average_daily_expense = monthly_expense_detail_data[:average_daily_expense]
          monthly_expense_detail.predict_total_monthly_expense = monthly_expense_detail_data[:predict_total_monthly_expense]
          monthly_expense_detail.save
        end

        { is_success: true, message: "Successed to delete" }
      else
        { is_success: false, message: "Failed to delete" }
      end
    end
  end
end
