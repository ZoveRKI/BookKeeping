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
    # 查找用户是否已经拥有某个年月的具体数据
    field :check_expense_table_data, resolver: Queries::CheckExpenseTableData

    # 查找用户已经拥有的所有年月
    field :get_user_existing_time, resolver: Queries::GetUserExistingTime

    # 查找用户某年某月花销详细数据
    field :get_detail_table_data, resolver: Queries::GetDetailTableData
  end
end
