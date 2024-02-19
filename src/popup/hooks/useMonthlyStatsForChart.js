import {gql, useQuery} from "@apollo/client";
import {useEffect, useState} from "react";

const GET_MONTHLY_STATS = gql`
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
const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;
const nowTimestamp = new Date().getTime();
const oneYearAgoTimestamp = nowTimestamp - ONE_YEAR;

export const useMonthlyStats = ({username}) => {



  const { loading, error, data } = useQuery(GET_MONTHLY_STATS, {
    variables: {
      username,
      input: {
        startTime: oneYearAgoTimestamp,
        endTime: nowTimestamp
      }
    },
  });

  console.log('got useMonthlyStats: ', username, data, error);

  return {
    loading,
    error,
    data
  }
}
