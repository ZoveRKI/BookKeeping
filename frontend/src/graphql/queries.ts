import { gql, type TypedDocumentNode } from '@apollo/client';

export interface ExistingTime {
  yearMonthId: string;
  year: number;
  month: number;
}

export interface ExpenseTableRowData {
  date: number;
  dailyExpense: number | null;
  additionalExpense: number[] | null;
  isEdited: boolean;
}

export interface ExpenseTableData {
  hasData: boolean;
  expenseTableData: ExpenseTableRowData[] | null;
}

export interface DetailTableData {
  recordedDate: number | null;
  totalMonthlyExpense: number | null;
  averageDailyExpense: number | null;
  predictTotalMonthlyExpense: number | null;
}

interface MonthVariables {
  yearMonthId: string;
}

export const CHECK_EXPENSE_TABLE_DATA_QUERY: TypedDocumentNode<
  { checkExpenseTableData: ExpenseTableData },
  MonthVariables
> = gql`
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

export const GET_USER_EXISTING_TIME_QUERY: TypedDocumentNode<
  { getUserExistingTime: { existingTime: ExistingTime[] } },
  Record<string, never>
> = gql`
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

export const GET_DETAIL_TABLE_DATA_QUERY: TypedDocumentNode<
  { getDetailTableData: DetailTableData },
  MonthVariables
> = gql`
  query GetDetailTableData($yearMonthId: ID!) {
    getDetailTableData(yearMonthId: $yearMonthId) {
      recordedDate
      totalMonthlyExpense
      averageDailyExpense
      predictTotalMonthlyExpense
    }
  }
`;
