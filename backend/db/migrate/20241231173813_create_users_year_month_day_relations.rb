class CreateUserYearMonthDayRelations < ActiveRecord::Migration[8.0]
  def change
    create_table :user_year_month_day_relations do |t|
      t.integer :user_id, null: false
      t.references :year_month, null: false, foreign_key: true
      t.integer :day, null: false

      t.timestamps
    end

    add_index :user_year_month_day_relations, [:user_id, :year_month_id], unique: true
    add_foreign_key :users_year_month_day_relations, :users, column: :user_id
  end
end
