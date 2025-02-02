module Mutations
  class AddTime < BaseMutation
    argument :year, Int, required: true
    argument :month, Int, required: true

    field :is_success, Boolean, null: false

    def resolve(year:, month:)
      authenticate_user!
      user = context[:current_user]

      return { is_success: false } unless user

      year_month = YearMonth.find_or_create_by(year: year, month: month)

      user_year_month_day_relation = UserYearMonthDayRelation.find_by(
        user_id: user.id,
        year_month_id: year_month.id,
      )

      if user_year_month_day_relation.nil?
        day = 1

        user_year_month_day_relation = UserYearMonthDayRelation.create(
          user_id: user.id,
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
