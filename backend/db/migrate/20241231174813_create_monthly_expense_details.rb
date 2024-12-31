class CreateMonthlyExpenseDetails < ActiveRecord::Migration[8.0]
  def change
    create_table :monthly_expense_details do |t|
      t.references :user, null: false, foreign_key: true
      t.references :year_month, null: false, foreign_key: true
      t.integer :average_daily_expense, null: false
      t.integer :total_monthly_expense, null: false
      t.integer :predict_total_monthly_expense, null: false

      t.timestamps
    end

    add_index :monthly_expense_details, [:user_id, :year_month_id], unique: true
  end
end
