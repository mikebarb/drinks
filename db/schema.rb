# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_12_29_065645) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "buttons", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "group"
    t.string "enable"
    t.integer "seq"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "drinks", id: :serial, force: :cascade do |t|
    t.string "name"
    t.integer "seq"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "orders", id: :serial, force: :cascade do |t|
    t.integer "person_id"
    t.integer "drink_id"
    t.integer "quantity"
    t.string "status"
    t.date "day"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "drink"
    t.index ["day"], name: "index_orders_on_day"
    t.index ["drink_id"], name: "index_orders_on_drink_id"
    t.index ["person_id"], name: "index_orders_on_person_id"
  end

  create_table "people", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "lastdrinkid"
    t.datetime "lastdrinktime"
    t.string "lastdrink"
  end

  add_foreign_key "orders", "drinks"
  add_foreign_key "orders", "people"
end
