class CreateAdditionalExpenses < ActiveRecord::Migration[8.0]
  def change
    create_table :additional_expenses do |t|
      t.references :user_year_month_day_relation, null: false, foreign_key: true
      t.bigint :additional_expense, null: false
      t.timestamps
    end
  end
end
