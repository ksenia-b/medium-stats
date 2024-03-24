import {gql, useQuery} from "@apollo/client";
import {useEffect, useState} from "react";

const GET_SUBSCRIPTIONS_STATS = gql`
  query SubscriptionStats($username: ID, $pagingOptions: PagingOptions) {
    userResult(username: $username) {
      __typename
      ... on User {
        ...SubscriptionStatsScreen_user
        viewerEdge {
          emailSubscriberConnection(paging: $pagingOptions) {
            __typename
          }
          __typename
        }
        __typename
      }
    }
    partnerProgramEnrollment {
      __typename
    }
  }

  fragment SubscriptionStatsScreen_user on User {
    id
    username
    viewerEdge {
      audienceStats {
        totals {
          ...AudienceStatsTotals_totals
          __typename
        }
        timeseries(granularity: AUDIENCE_STATS_MONTHLY) {
          ...AudienceStatsTable_timeseries
          __typename
        }
        __typename
      }
      __typename
      id
    }
    ...EmailSubscriberDetails_user
    ...AudienceStatsTable_user
    __typename
  }

  fragment AudienceStatsTotals_totals on AudienceStatsTotals {
    followers
    subscribers
    followersPreviousMonth
    subscribersPreviousMonth
    __typename
  }

  fragment AudienceStatsTable_timeseries on AudienceStatsTimeseries {
    collectedAt
    followersGained
    followersLost
    followersNet
    followersTotal
    subscribersGained
    subscribersLost
    subscribersNet
    subscribersTotal
    convertedMembersNet
    convertedMembersTotal
    convertedMemberEarningsInCents
    __typename
  }

  fragment EmailSubscriberDetails_user on User {
    id
    username
    newsletterV3 {
      id
      __typename
    }
    viewerEdge {
      emailSubscriberConnection(paging: $pagingOptions) {
        __typename
        ... on SubscriberConnection {
          subscribers {
            id
            email
            unverifiedEmail
            subscribedAt
            name
            username
            imageId
            isImported
            __typename
          }
          pagingInfo {
            next {
              limit
              from
              __typename
            }
            __typename
          }
          __typename
        }
      }
      __typename
      id
    }
    __typename
  }

  fragment AudienceStatsTable_user on User {
    id
    username
    __typename
  }

`;

export const useSubscriptionStats = ({username}) => {
  const { loading, error, data } = useQuery(GET_SUBSCRIPTIONS_STATS, {
    variables: {
      username,
    }
  });

  return {
    loading,
    error,
    data: data?.userResult
  }
}
