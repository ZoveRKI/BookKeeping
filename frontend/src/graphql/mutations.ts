import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      isSuccess
      messages
      userId
    }
  }
`;

export const ADD_TIME_MUTATION = gql`
  mutation AddTime($input: AddTimeInput!) {
    addTime(input: $input) {
      isSuccess
    }
  }
`;

export const SAVE_ROW_DATA_MUTATION = gql`
  mutation SaveRowData($input: SaveRowDataInput!) {
    saveRowData(input: $input) {
      isSuccess
      message
      date
    }
  }
`;
