import {gql, useQuery} from "@apollo/client";
import {useEffect, useState} from "react";

const GET_STATS = gql`
  query LifetimeStoriesStatsQuery($username: ID!, $first: Int!, $after: String!, $orderBy: UserPostsOrderBy, $filter: UserPostsFilter) {
    user(username: $username) {
      id
      postsConnection(
        first: $first
        after: $after
        orderBy: $orderBy
        filter: $filter
      ) {
        edges {
          node {
            ...LifetimeStoriesStats_post
            __typename
          }
          __typename
        }
        pageInfo {
          endCursor
          hasNextPage
          __typename
        }
        __typename
      }
      __typename
    }
  }

  fragment LifetimeStoriesStats_post on Post {
    id
    ...StoriesStatsTable_post
    ...MobileStoriesStatsTable_post
    __typename
    clapCount
    postResponses {
      count
    }
    viewerEdge {
      __typename
      id
      clapCount
      readingList
      shareKey
      creatorPartnerProgramEnrollmentStatus
    }

  }

  fragment StoriesStatsTable_post on Post {
    ...StoriesStatsTableRow_post
    __typename
    id
  }

  fragment StoriesStatsTableRow_post on Post {
    id
    ...TablePostInfos_post
    firstPublishedAt
    milestones {
      boostedAt
      __typename
    }
    isLocked
    totalStats {
      views
      reads
      __typename
    }
    earnings {
      total {
        currencyCode
        nanos
        units
        __typename
      }
      __typename
    }
    __typename
  }

  fragment TablePostInfos_post on Post {
    id
    title
    firstPublishedAt
    readingTime
    isLocked
    visibility
    ...usePostUrl_post
    ...Star_post
    __typename
  }

  fragment usePostUrl_post on Post {
    id
    creator {
      ...userUrl_user
      __typename
      id
    }
    collection {
      id
      domain
      slug
      __typename
    }
    isSeries
    mediumUrl
    sequence {
      slug
      __typename
    }
    uniqueSlug
    __typename
  }

  fragment userUrl_user on User {
    __typename
    id
    customDomainState {
      live {
        domain
        __typename
      }
      __typename
    }
    hasSubdomain
    username
  }

  fragment Star_post on Post {
    id
    creator {
      id
      __typename
    }
    __typename
  }

  fragment MobileStoriesStatsTable_post on Post {
    id
    ...TablePostInfos_post
    firstPublishedAt
    milestones {
      boostedAt
      __typename
    }
    isLocked
    totalStats {
      reads
      views
      __typename
    }
    earnings {
      total {
        currencyCode
        nanos
        units
        __typename
      }
      __typename
    }
    __typename
  }
`;

export const useStats = ({username}) => {
  const { loading, error, data } = useQuery(GET_STATS, {
    variables: {
      username,
      first: 10,
      after: "",
      orderBy: null,
      filter: null
    }
  });

  const parsedData = data && data.user.postsConnection.edges.map(edge => {
    const node = edge.node || {};
    return ({
      clapCount: node.clapCount,
      id: node.id,
      postResponses: node.postResponses?.count,
      readingTime: node.readingTime,
      reads: node.totalStats?.reads,
      views: node.totalStats?.views,
      slug: node.uniqueSlug,
    })

  });

  if (!loading && parsedData) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "your_message", data: parsedData});
    });
  }

  return {
    loading,
    error,
    data: parsedData || []
  }
}
