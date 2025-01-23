module Mutations
  class DeleteRowData < BaseMutation
    argument :user_id, ID, required: true
    argument :year_month_id, ID, required: true
    argument :date, Int, required: true

    field :is_success, Boolean, null: false
    field :message, String, null: true

    def resolve(user_id:, year_month_id:, date:)
      user_year_month_day_relation = UserYearMonthDayRelation.find_by(
        user_id: user_id,
        year_month_id: year_month_id,
        day: date,
      )

      if user_year_month_day_relation&.destroy
        { is_success: true, message: "Successed to delete" }
      else
        { is_success: false, message: "Failed to delete" }
      end
    end
  end
end
