# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20200311104049) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "drinks", force: :cascade do |t|
    t.string   "name"
    t.integer  "seq"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "orders", force: :cascade do |t|
    t.integer  "person_id"
    t.integer  "drink_id"
    t.integer  "quantity"
    t.string   "status"
    t.date     "day"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "drink"
    t.index ["day"], name: "index_orders_on_day", using: :btree
    t.index ["drink_id"], name: "index_orders_on_drink_id", using: :btree
    t.index ["person_id"], name: "index_orders_on_person_id", using: :btree
  end

  create_table "people", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.integer  "lastdrinkid"
    t.datetime "lastdrinktime"
    t.string   "lastdrink"
  end

  add_foreign_key "orders", "drinks"
  add_foreign_key "orders", "people"
end
