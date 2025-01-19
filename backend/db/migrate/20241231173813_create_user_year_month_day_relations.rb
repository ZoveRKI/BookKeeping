class CreateUserYearMonthDayRelations < ActiveRecord::Migration[8.0]
  def change
    create_table :user_year_month_day_relations do |t|
      t.references :user, null: false, foreign_key: true
      t.references :year_month, null: false, foreign_key: true
      t.bigint :day, null: false

      t.timestamps
    end

    add_index :user_year_month_day_relations, [:user_id, :year_month_id, :day], unique: true
  end
end
