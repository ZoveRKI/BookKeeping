require "test_helper"

class UserYearMonthFlowTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  ADD_TIME_MUTATION = <<~GRAPHQL
    mutation AddTime($input: AddTimeInput!) {
      addTime(input: $input) {
        isSuccess
      }
    }
  GRAPHQL

  GET_EXISTING_TIME_QUERY = <<~GRAPHQL
    query GetUserExistingTime {
      getUserExistingTime {
        existingTime {
          yearMonthId
          year
          month
        }
      }
    }
  GRAPHQL

  GET_DETAIL_QUERY = <<~GRAPHQL
    query GetDetailTableData($yearMonthId: ID!) {
      getDetailTableData(yearMonthId: $yearMonthId) {
        recordedDate
      }
    }
  GRAPHQL

  SAVE_ROW_MUTATION = <<~GRAPHQL
    mutation SaveRowData($input: SaveRowDataInput!) {
      saveRowData(input: $input) {
        isSuccess
      }
    }
  GRAPHQL

  setup do
    @user = User.create!(
      user_name: "user-year-month-flow-#{SecureRandom.hex(4)}",
      password: "password"
    )
  end

  test "adding a month does not create a placeholder day" do
    result = execute(
      ADD_TIME_MUTATION,
      input: { year: 2026, month: 6 }
    )

    assert result.dig("data", "addTime", "isSuccess")

    year_month = YearMonth.find_by!(year: 2026, month: 6)

    user_year_month = UserYearMonth.find_by!(user: @user, year_month: year_month)

    assert_not user_year_month.user_year_month_day_relations.exists?

    existing_time = execute(GET_EXISTING_TIME_QUERY)
      .dig("data", "getUserExistingTime", "existingTime")

    assert_equal year_month.id.to_s, existing_time.first["yearMonthId"]

    detail = execute(
      GET_DETAIL_QUERY,
      yearMonthId: year_month.id
    )

    assert_equal 0, detail.dig(
      "data",
      "getDetailTableData",
      "recordedDate"
    )
  end

  test "saving the first expense changes recorded date from zero to one" do
    execute(
      ADD_TIME_MUTATION,
      input: { year: 2026, month: 7 }
    )

    year_month = YearMonth.find_by!(year: 2026, month: 7)

    result = execute(
      SAVE_ROW_MUTATION,
      input: {
        yearMonthId: year_month.id,
        date: 1,
        dailyExpense: 100.0
      }
    )

    assert result.dig("data", "saveRowData", "isSuccess")

    user_year_month = UserYearMonth.find_by!(user: @user, year_month: year_month)
    relation = user_year_month.user_year_month_day_relations.find_by!(day: 1)
    monthly_expense_detail = user_year_month.monthly_expense_detail

    assert_equal user_year_month.id, relation.user_year_month_id
    assert_equal user_year_month.id, monthly_expense_detail.user_year_month_id
    assert_equal 1, MonthlyExpenseDetail.where(user_year_month: user_year_month).count

    detail = execute(
      GET_DETAIL_QUERY,
      yearMonthId: year_month.id
    )

    assert_equal 1, detail.dig(
      "data",
      "getDetailTableData",
      "recordedDate"
    )
  end

  private

  def execute(document, variables = {})
    BackendSchema.execute(
      document,
      variables: variables,
      context: { current_user: @user }
    ).to_h
  end
end
