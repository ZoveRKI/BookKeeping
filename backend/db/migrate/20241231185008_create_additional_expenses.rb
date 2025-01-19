class CreateAdditionalExpenses < ActiveRecord::Migration[8.0]
  def change
    create_table :additional_expenses do |t|
      t.references :user_year_month_day_relation, null: false, foreign_key: true
      t.decimal :additional_expense, precision: 15, scale: 5, null: false
      t.timestamps
    end
  end
end
