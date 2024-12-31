class CreateYearMonths < ActiveRecord::Migration[8.0]
  def change
    create_table :year_months do |t|
      t.integer :year, null: false
      t.integer :month, null: false

      t.timestamps
    end

    add_index :year_months, [:year, :month], unique: true
  end
end
