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

    assert UserYearMonth.exists?(user: @user, year_month: year_month)
    assert_not UserYearMonthDayRelation.exists?(
      user: @user,
      year_month: year_month
    )

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
