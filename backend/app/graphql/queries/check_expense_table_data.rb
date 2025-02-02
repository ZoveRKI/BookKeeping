module Queries
  class CheckExpenseTableData < BaseQuery
    type Types::CheckExpenseTableDataType, null: false
    argument :year_month_id, ID, required: true

    def resolve(year_month_id:)
      user = context[:current_user]

      user_year_month_day_relations = UserYearMonthDayRelation.where(user_id: user.id, year_month_id: year_month_id).order(:day)

      expense_table_data = []

      if user_year_month_day_relations.present?
        user_year_month_day_relations.each do |user_year_month_day_relation|
          day = user_year_month_day_relation.day

          daily_expense = DailyExpense.find_by(user_year_month_day_relation_id: user_year_month_day_relation.id)
          amount_of_daily = daily_expense&.daily_expense

          list_of_additional_expenses = []

          additional_expenses = AdditionalExpense.where(user_year_month_day_relation_id: user_year_month_day_relation.id)

          if additional_expenses.present?
            additional_expenses.each do |additional_expense|
              list_of_additional_expenses.push(
                additional_expense.additional_expense
              )
            end
          end

          expense_table_data.push({
            date: day,
            daily_expense: amount_of_daily,
            additional_expense: list_of_additional_expenses,
            is_edited: false
          })
        end

        table_data_length = expense_table_data.length

        if table_data_length > 1 || (table_data_length == 1 && expense_table_data[0][:daily_expense].present?)
          { has_data: true, expense_table_data: expense_table_data }
        else
          { has_data: false }
        end
      else
        { has_data: false }
      end
    end
  end
end
