module Queries
  class GetUserExistingTime < Queries::BaseQuery
    type Types::GetUserExistingTimeType, null: false

    def resolve()
      user = context[:current_user]

      user_year_months = UserYearMonthDayRelation.where(user_id: user.id).select(:year_month_id).distinct

      year_month_list = []
      if user_year_months.present?
        user_year_months.each do |user_year_month|
          year_month = YearMonth.find_by(id: user_year_month.year_month_id)

          year_month_list.push({
            year_month_id: year_month.id,
            year: year_month.year,
            month: year_month.month
          })
        end
      end

      { existing_time: year_month_list }
    end
  end
end
