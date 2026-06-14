class CreateUserYearMonths < ActiveRecord::Migration[8.0]
  def up
    create_table :user_year_months do |t|
      t.references :user, null: false, foreign_key: true
      t.references :year_month, null: false, foreign_key: true

      t.timestamps
    end

    add_index :user_year_months, [ :user_id, :year_month_id ], unique: true
  end
end
