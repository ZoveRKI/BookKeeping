class CreateMonthlyExpenseDetails < ActiveRecord::Migration[8.0]
  def change
    create_table :monthly_expense_details do |t|
      t.references :user, null: false, foreign_key: true
      t.references :year_month, null: false, foreign_key: true
      t.decimal :average_daily_expense, precision: 15, scale: 5, null: false
      t.decimal :total_monthly_expense, precision: 15, scale: 5, null: false
      t.decimal :predict_total_monthly_expense, precision: 15, scale: 5, null: false

      t.timestamps
    end

    add_index :monthly_expense_details, [:user_id, :year_month_id, :average_daily_expense, :total_monthly_expense, :predict_total_monthly_expense], unique: true
  end
end
