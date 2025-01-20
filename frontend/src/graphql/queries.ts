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
