import { gql } from '@apollo/client';

export const CHECK_EXPENSE_TABLE_DATA_QUERY = gql`
  query CheckExpenseTableData($yearMonthId: ID!) {
    checkExpenseTableData(yearMonthId: $yearMonthId) {
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
  query GetUserExistingTime {
    getUserExistingTime {
        existingTime {
          yearMonthId
          year
          month
        }
    }
  }
`;

export const GET_DETAIL_TABLE_DATA_QUERY = gql`
  query GetDetailTableData($yearMonthId: ID!) {
    getDetailTableData(yearMonthId: $yearMonthId) {
      recordedDate
      totalMonthlyExpense
      averageDailyExpense
      predictTotalMonthlyExpense
    }
  }
`;
