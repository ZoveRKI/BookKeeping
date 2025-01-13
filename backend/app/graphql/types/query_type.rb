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

    # TODO: remove me
    field :check_time_exists, Types::CheckDataResultType, null: false do
      argument :user_id, ID, required: true
      argument :year, Int, required: true
      argument :month, Int, required: true
    end

    def check_time_exists(user_id:, year:, month:)
      # 查找对应的 YearMonth 记录
      year_month = YearMonth.find_by(year: year, month: month)

      if year_month && UserYearMonthDayRelation.exists?(user_id: user_id, year_month_id: year_month.id)
        { is_success: true }
      else
        { is_success: false }
      end
    end
  end
end
