import {gql} from "@apollo/client";

export const GET_POST_STATS_DAILY_BUNDLE = gql`
  query useStatsPostNewChartDataQuery($postStatsDailyBundleInput: PostStatsDailyBundleInput!) {

    postStatsDailyBundle(postStatsDailyBundleInput: $postStatsDailyBundleInput) {
      buckets {
        ...newBucketTimestamps_postStatsDailyBundleBucket
        __typename
      }
      __typename
    }
  }

  fragment newBucketTimestamps_postStatsDailyBundleBucket on PostStatsDailyBundleBucket {
    dayStartsAt
    membershipType
    readersThatReadCount
    readersThatViewedCount
    readersThatClappedCount
    readersThatRepliedCount
    readersThatHighlightedCount
    readersThatInitiallyFollowedAuthorFromThisPostCount
    __typename
  }
`;
