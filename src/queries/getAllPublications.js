import {gql} from "@apollo/client";

export const GET_ALL_PUBLICATIONS = gql`
  query PublishingSettingsQuery {
    viewer {
      adminCollections {
        id
        name
        slug
      }
      writerCollections {
        id
        name
        slug
      }
    }
  }
`
