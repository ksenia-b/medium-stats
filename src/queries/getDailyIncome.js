import {gql} from "@apollo/client";

export const GET_DAILY_INCOME = gql`
  query GetDailyIncome($postId: ID!, $startAt: Long!, $endAt: Long!) {
    post(id: $postId) {
      id
      earnings {
        dailyEarnings(startAt: $startAt, endAt: $endAt) {
          periodStartedAt
          amount
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

