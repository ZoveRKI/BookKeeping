module Types
  class CheckDataResultType < Types::BaseObject
    field :is_success, Boolean, null: false
    field :year_month_id, ID, null: true
  end
end
