class ComputeMonthlyExpenseDetailDataService
  def initialize(user_id:, year_month_id:)
    @user_id = user_id
    @year_month_id = year_month_id
  end

  def call
    year_month = YearMonth.find(@year_month_id)

    total_monthly_expense = 0
    current_month = year_month.month()
    current_year = year_month.year()
    currentMonthDay = Time.days_in_month(current_month, current_year)

    user_year_month_day_relations = UserYearMonthDayRelation.where(user_id: @user_id, year_month_id: @year_month_id)
    now_days_count = user_year_month_day_relations.count

    ActiveRecord::Base.transaction do
      user_year_month_day_relations.each do |user_year_month_day_relation|
        one_day_daily_expense = DailyExpense.find_by(user_year_month_day_relation_id: user_year_month_day_relation.id).daily_expense

        one_day_additional_expense = AdditionalExpense.where(user_year_month_day_relation_id: user_year_month_day_relation.id).sum(:additional_expense)

        one_day_total_expense = one_day_daily_expense + one_day_additional_expense

        total_monthly_expense += one_day_total_expense
      end
    end

    average_daily_expense = now_days_count > 0 ?  total_monthly_expense / now_days_count : 0.0
    predict_total_monthly_expense = average_daily_expense * currentMonthDay

    {
      total_monthly_expense: total_monthly_expense,
      average_daily_expense: average_daily_expense,
      predict_total_monthly_expense: predict_total_monthly_expense
    }
  end
end
