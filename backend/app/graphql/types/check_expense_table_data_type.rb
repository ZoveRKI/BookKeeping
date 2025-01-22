module Types
  class ExpenseTableDataType < Types::BaseObject
    field :date, Int, null: false
    field :daily_expense, Float, null: true
    field :additional_expense, [Float], null: true
    field :is_edited, Boolean, null: false
  end

  class CheckExpenseTableDataType < Types::BaseObject
    field :has_data, Boolean, null: false
    field :expense_table_data, [ExpenseTableDataType], null: true
  end
end
