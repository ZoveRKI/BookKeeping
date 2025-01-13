import { gql } from '@apollo/client';

export const CHECK_TIME_EXISTS_QUERY = gql`
  query CheckTimeExists($userId: ID!, $year: Int!, $month: Int!) {
    checkTimeExists(userId: $userId, year: $year, month: $month) {
        isSuccess
    }
  }
`;
