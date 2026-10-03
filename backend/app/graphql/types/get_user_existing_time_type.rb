module Types
  class ExistingTimeType < Types::BaseObject
    field :year_month_id, ID, null: false
    field :year, Int, null: false
    field :month, Int, null: false
  end

  class GetUserExistingTimeType < Types::BaseObject
    field :existing_time, [ ExistingTimeType ], null: false
  end
end
