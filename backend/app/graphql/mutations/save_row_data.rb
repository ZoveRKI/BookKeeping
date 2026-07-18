module Mutations
  class SaveRowData < BaseMutation
    argument :year_month_id, ID, required: true
    argument :date, Int, required: true
    argument :daily_expense, Float, required: true
    argument :additional_expense, Float, required: false

    field :is_success, Boolean, null: false
    field :message, String, null: true
    field :date, Int, null: true

    def resolve(year_month_id:, date:, daily_expense:, additional_expense: nil)
      authenticate_user!
      user = context[:current_user]

      return { is_success: false, message: "You must be logged in" } unless user

      user_year_month = user.user_year_months.find_or_create_by!(year_month_id: year_month_id)

      user_year_month_day_relation = user_year_month.user_year_month_day_relations.find_or_create_by!(day: date)

      expense_of_daily = DailyExpense.find_or_initialize_by(
        user_year_month_day_relation_id: user_year_month_day_relation.id,
      )

      expense_of_daily.daily_expense = daily_expense
      expense_of_daily.save

      if additional_expense.present? && additional_expense > 0
        expense_of_additional = AdditionalExpense.find_or_initialize_by(
          user_year_month_day_relation_id: user_year_month_day_relation.id
        )

        expense_of_additional.additional_expense = additional_expense
        expense_of_additional.save
      elsif additional_expense.present? && additional_expense == 0
        expense_of_additional = AdditionalExpense.find_by(
          user_year_month_day_relation_id: user_year_month_day_relation.id
        )   # 修改时无需initialize，直接查找即可

        expense_of_additional&.destroy if expense_of_additional.present?
      end

      monthly_expense_detail_data = ComputeMonthlyExpenseDetailDataService.new(
        user_id: user.id,
        year_month_id: year_month_id
      ).call

      if monthly_expense_detail_data.present?
        monthly_expense_detail = user_year_month.monthly_expense_detail || user_year_month.build_monthly_expense_detail

        monthly_expense_detail.total_monthly_expense = monthly_expense_detail_data[:total_monthly_expense]
        monthly_expense_detail.average_daily_expense = monthly_expense_detail_data[:average_daily_expense]
        monthly_expense_detail.predict_total_monthly_expense = monthly_expense_detail_data[:predict_total_monthly_expense]
        monthly_expense_detail.save
      end

      if expense_of_daily.present?
        if expense_of_additional.present?
          { is_success: true, date: date, message: "Daily and Additional expense data saved successfully" }
        else
          { is_success: true, date: date, message: "Daily expense data saved successfully" }
        end
      else
        { is_success: false }
      end
    end
  end
end
