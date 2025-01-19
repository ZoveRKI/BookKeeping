module Mutations
  class SaveRowData < BaseMutation
    argument :user_id, ID, required: true
    argument :year_month_id, ID, required: true
    argument :date, Int, required: true
    argument :daily_expense, Float, required: true
    argument :additional_expense, Float, required: false

    field :is_success, Boolean, null: false
    field :message, String, null: true
    field :date, Int, null: true

    def resolve(user_id:, year_month_id:, date:, daily_expense:, additional_expense: nil)
      user_year_month_day_relation = UserYearMonthDayRelation.find_or_create_by(
        user_id: user_id,
        year_month_id: year_month_id,
        day: date,
      )

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
