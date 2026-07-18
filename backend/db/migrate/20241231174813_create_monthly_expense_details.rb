class CreateMonthlyExpenseDetails < ActiveRecord::Migration[8.0]
  def change
    create_table :monthly_expense_details do |t|
      t.references :user_year_month, null: false, foreign_key: true, index: { unique: true }
      t.decimal :average_daily_expense, precision: 15, scale: 5, null: false
      t.decimal :total_monthly_expense, precision: 15, scale: 5, null: false
      t.decimal :predict_total_monthly_expense, precision: 15, scale: 5, null: false

      t.timestamps
    end
  end
end
