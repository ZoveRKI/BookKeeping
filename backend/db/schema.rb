# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_06_14_000000) do
  create_table "additional_expenses", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_year_month_day_relation_id", null: false
    t.decimal "additional_expense", precision: 15, scale: 5, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_year_month_day_relation_id"], name: "index_additional_expenses_on_user_year_month_day_relation_id"
  end

  create_table "daily_expenses", primary_key: "user_year_month_day_relation_id", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.decimal "daily_expense", precision: 15, scale: 5, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_year_month_day_relation_id"], name: "index_daily_expenses_on_user_year_month_day_relation_id"
  end

  create_table "monthly_expense_details", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "year_month_id", null: false
    t.decimal "average_daily_expense", precision: 15, scale: 5, null: false
    t.decimal "total_monthly_expense", precision: 15, scale: 5, null: false
    t.decimal "predict_total_monthly_expense", precision: 15, scale: 5, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "year_month_id", "average_daily_expense", "total_monthly_expense", "predict_total_monthly_expense"], name: "idx_on_user_id_year_month_id_average_daily_expense__5f9d929b93", unique: true
    t.index ["user_id"], name: "index_monthly_expense_details_on_user_id"
    t.index ["year_month_id"], name: "index_monthly_expense_details_on_year_month_id"
  end

  create_table "notes", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "additional_expense_id", null: false
    t.string "note", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["additional_expense_id"], name: "index_notes_on_additional_expense_id"
  end

  create_table "user_year_month_day_relations", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "year_month_id", null: false
    t.bigint "day", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "year_month_id", "day"], name: "idx_on_user_id_year_month_id_day_6b2aa1c97a", unique: true
    t.index ["user_id"], name: "index_user_year_month_day_relations_on_user_id"
    t.index ["year_month_id"], name: "index_user_year_month_day_relations_on_year_month_id"
  end

  create_table "user_year_months", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "year_month_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "year_month_id"], name: "index_user_year_months_on_user_id_and_year_month_id", unique: true
    t.index ["user_id"], name: "index_user_year_months_on_user_id"
    t.index ["year_month_id"], name: "index_user_year_months_on_year_month_id"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "user_name", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "year_months", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "year", null: false
    t.bigint "month", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["year", "month"], name: "index_year_months_on_year_and_month", unique: true
  end

  add_foreign_key "additional_expenses", "user_year_month_day_relations"
  add_foreign_key "daily_expenses", "user_year_month_day_relations"
  add_foreign_key "monthly_expense_details", "users"
  add_foreign_key "monthly_expense_details", "year_months"
  add_foreign_key "notes", "additional_expenses"
  add_foreign_key "user_year_month_day_relations", "users"
  add_foreign_key "user_year_month_day_relations", "year_months"
  add_foreign_key "user_year_months", "users"
  add_foreign_key "user_year_months", "year_months"
end
