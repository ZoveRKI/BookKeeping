module Types
  class AdditionalExpenseType < Types::BaseObject
    field :amount, Float, null: false
  end

  class ExpenseTableDataType < Types::BaseObject
    field :date, String, null: false
    field :daily_expense, Float, null: true
    field :additional_expense, [AdditionalExpenseType], null: true
    field :is_edited, Boolean, null: false
  end

  class CheckExpenseTableDataType < Types::BaseObject
    field :has_data, Boolean, null: false
    field :expense_table_data, [ExpenseTableDataType], null: true
  end
end
