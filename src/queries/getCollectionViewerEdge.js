import {gql} from "@apollo/client";

export const GET_COLLECTION_VIEWER_EDGE = gql`
  query LifetimeStoriesStatsQuery($collectionId: ID!) {
    collection(id: $collectionId) {
      id
      viewerEdge {
        canEditOwnPosts
        canEditPosts
        isEditor
        isFollowing
        isMuting
        isSubscribedToEmails
        isSubscribedToLetters
        isSubscribedToMediumNewsletter
        isWriter
      }
    }
  }
`
