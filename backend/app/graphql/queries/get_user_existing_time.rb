module Queries
  class GetUserExistingTime < Queries::BaseQuery
    type Types::GetUserExistingTimeType, null: false

    def resolve
      user = context[:current_user]

      user_year_months = UserYearMonth
        .where(user_id: user.id)
        .includes(:year_month)

      year_month_list = user_year_months.map do |user_year_month|
        year_month = user_year_month.year_month

        {
          year_month_id: year_month.id,
          year: year_month.year,
          month: year_month.month
        }
      end.sort_by { |item| [ item[:year], item[:month] ] }

      { existing_time: year_month_list }
    end
  end
end
