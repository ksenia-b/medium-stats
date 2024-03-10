import {gql} from "@apollo/client";

export const GET_MONTHLY_STATS_READS_VIEWS = gql`
  query MonthlyStatsAndChartQuery($username: ID!, $input: UserPostsAggregateStatsInput!) {
    user(username: $username) {
      id
      postsAggregateTimeseriesStats(input: $input) {
        __typename
        ... on AggregatePostTimeseriesStats {
          totalStats {
            viewers
            readers
            __typename
          }
          points {
            ...MonthlyChart_postStatsPoint
            __typename
          }
          __typename
        }
      }
      __typename
    }
  }

  fragment MonthlyChart_postStatsPoint on PostStatsPoint {
    timestamp
    stats {
      total {
        viewers
        readers
        __typename
      }
      __typename
    }
    __typename
  }

`;
