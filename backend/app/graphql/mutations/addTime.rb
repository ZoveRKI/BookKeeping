module Mutations
  class AddTime < BaseMutation
    argument :user_id, ID, required: true
    argument :year, Int, required: true
    argument :month, Int, required: true

    field :is_success, Boolean, null: false

    def resolve(user_id:, year:, month:)
      year_month = YearMonth.find_or_create_by(year: year, month: month)

      user_year_month_day_relation = UserYearMonthDayRelation.find_by(
        user_id: user_id,
        year_month_id: year_month.id,
      )

      if user_year_month_day_relation.nil?
        day = 1

        user_year_month_day_relation = UserYearMonthDayRelation.create(
          user_id: user_id,
          year_month_id: year_month.id,
          day: day
        )
      end

      if user_year_month_day_relation.persisted?
        { is_success: true }
      else
        { is_success: false }
      end
    end
  end
end
