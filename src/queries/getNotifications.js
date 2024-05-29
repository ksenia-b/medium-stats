import {gql} from "@apollo/client";

export const GET_NOTIFICATIONS = gql`
  query NotificationsQuery($activityTypes: [String!], $pagingOptions: PagingOptions) {
    notificationsConnectionByActivityTypes(activityTypes: $activityTypes, paging: $pagingOptions) {
      notifications {
        notificationType
        occurredAt
        actor {
          name
          username
          membership {
            id
            tier
          }
        }
        rollupItems {
          actor {
            name
            username
            membership {
              id
              tier
            }
          }
        }
      }
      pagingInfo {
        next {
          page
          limit
          source
          to
        }
      }
    }
  }
`
