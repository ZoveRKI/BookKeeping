class CreateMonthlyExpenseDetails < ActiveRecord::Migration[8.0]
  def change
    create_table :monthly_expense_details do |t|
      t.references :user, null: false, foreign_key: true
      t.references :year_month, null: false, foreign_key: true
      t.bigint :average_daily_expense, null: false
      t.bigint :total_monthly_expense, null: false
      t.bigint :predict_total_monthly_expense, null: false

      t.timestamps
    end

    add_index :monthly_expense_details, [:user_id, :year_month_id], unique: true
  end
end
