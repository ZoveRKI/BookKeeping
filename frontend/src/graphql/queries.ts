import { gql } from '@apollo/client';

export const CHECK_TIME_EXISTS_QUERY = gql`
  query CheckTimeExists($userId: ID!, $year: Int!, $month: Int!) {
    checkTimeExists(userId: $userId, year: $year, month: $month) {
        isSuccess
        yearMonthId
    }
  }
`;

export const CHECK_EXPENSE_TABLE_DATA_QUERY = gql`
  query CheckExpenseTableData($userId: ID!, $yearMonthId: ID!) {
    checkExpenseTableData(userId: $userId, yearMonthId: $yearMonthId) {
        hasData
        expenseTableData {
          date
          dailyExpense
          additionalExpense
          isEdited
        }
    }
  }
`;

export const GET_USER_EXISTING_TIME_QUERY = gql`
  query GetUserExistingTime($userId: ID!) {
    getUserExistingTime(userId: $userId) {
        existingTime {
          yearMonthId
          year
          month
        }
    }
  }
`;

export const GET_DETAIL_TABLE_DATA_QUERY = gql`
  query GetDetailTableData($userId: ID!, $yearMonthId: ID!) {
    getDetailTableData(userId: $userId, yearMonthId: $yearMonthId) {
      totalMonthlyExpense
      averageDailyExpense
      predictTotalMonthlyExpense
    }
  }
`;
