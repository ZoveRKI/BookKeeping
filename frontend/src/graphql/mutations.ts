import { gql, type TypedDocumentNode } from '@apollo/client';

export const LOGIN_MUTATION: TypedDocumentNode<
  { login: { isSuccess: boolean; messages: string[] | null } | null },
  { input: { userName: string; password: string } }
> = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      isSuccess
      messages
    }
  }
`;

export const ADD_TIME_MUTATION: TypedDocumentNode<
  { addTime: { isSuccess: boolean } | null },
  { input: { year: number; month: number } }
> = gql`
  mutation AddTime($input: AddTimeInput!) {
    addTime(input: $input) {
      isSuccess
    }
  }
`;

export const SAVE_ROW_DATA_MUTATION: TypedDocumentNode<
  { saveRowData: { isSuccess: boolean; message: string | null; date: number | null } | null },
  { input: { yearMonthId: string; date: number; dailyExpense: number; additionalExpense?: number } }
> = gql`
  mutation SaveRowData($input: SaveRowDataInput!) {
    saveRowData(input: $input) {
      isSuccess
      message
      date
    }
  }
`;

export const DELETE_ROW_DATA_MUTATION: TypedDocumentNode<
  { deleteRowData: { isSuccess: boolean; message: string | null } | null },
  { input: { yearMonthId: string; date: number } }
> = gql`
  mutation DeleteRowData($input: DeleteRowDataInput!) {
    deleteRowData(input: $input) {
      isSuccess
      message
    }
  }
`;
