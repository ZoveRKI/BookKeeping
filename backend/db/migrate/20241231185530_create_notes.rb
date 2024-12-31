class CreateNotes < ActiveRecord::Migration[8.0]
  def change
    create_table :notes do |t|
      t.references :additional_expense, null: false, foreign_key: true
      t.string :note, null: false
      t.timestamps
    end
  end
end
