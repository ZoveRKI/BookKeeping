# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ID], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    # My Query
    # 查找用户是否已经拥有某个年月
    field :check_time_exists, Types::CheckTimeExistsType, null: false do
      argument :user_id, ID, required: true
      argument :year, Int, required: true
      argument :month, Int, required: true
    end

    def check_time_exists(user_id:, year:, month:)
      # 查找对应的 YearMonth 记录
      year_month = YearMonth.find_by(year: year, month: month)

      if year_month && UserYearMonthDayRelation.exists?(user_id: user_id, year_month_id: year_month.id)
        { is_success: true, year_month_id: year_month.id }
      else
        { is_success: false }
      end
    end

    # 查找用户是否已经拥有某个年月的具体数据
    field :check_expense_table_data, Types::CheckExpenseTableDataType, null: false do
      argument :user_id, ID, required: true
      argument :year_month_id, ID, required: true
    end

    def check_expense_table_data(user_id:, year_month_id:)
      user_year_month_day_relations = UserYearMonthDayRelation.where(user_id: user_id, year_month_id: year_month_id)

      expense_table_data = []

      if user_year_month_day_relations.present?
        user_year_month_day_relations.each do |user_year_month_day_relation|
          day = user_year_month_day_relation.day

          daily_expense = DailyExpense.find_by(user_year_month_day_relation_id: user_year_month_day_relation.id)

          list_of_additional_expenses = []

          additional_expenses = AdditionalExpense.where(user_year_month_day_relation_id: user_year_month_day_relation.id)

          additional_expenses.each do |additional_expense|
            list_of_additional_expenses.push(
              additional_expense.additional_expense
            )
          end

          expense_table_data.push({
            date: day,
            daily_expense: daily_expense,
            additional_expense: list_of_additional_expenses,
            is_edited: false
          })
        end

        table_data_length = expense_table_data.length

        if table_data_length > 1
          if expense_table_data[table_data_length - 1][:daily_expense] != nil
            { has_data: true, expense_table_data: expense_table_data }
          end
          expense_table_data = expense_table_data[0..table_data_length - 2]
          { has_data: true, expense_table_data: expense_table_data }
        elsif table_data_length == 1 && expense_table_data[0][:daily_expense] != nil
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
