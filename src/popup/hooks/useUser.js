import {gql, useQuery} from "@apollo/client";
import {useEffect, useState} from "react";

const GET_USER_INFO = gql`
  query AvatarMenuQuery {
    viewer {
      ...AvatarMenu_user
      __typename
    }
    partnerProgramEnrollment {
      __typename
    }
  }

  fragment AvatarMenu_user on User {
    id
    membership {
      memberSince
      tier
      __typename
      id
    }
    emailObfuscated
    ...userUrl_user
    ...useIsVerifiedBookAuthor_user
    adminCollections {
      id
      name
      ...CollectionMenuItem_collection
      __typename
    }
    linkedAccounts {
      viewerEdge {
        mediumMastodon {
          id
          __typename
        }
        __typename
      }
      __typename
      id
    }
    viewerEdge {
      membership {
        ...useIsReactivateMembershipVisible_membershipStatus
        ...useCanSwitchMembershipPlan_membershipStatus
        __typename
      }
      __typename
      id
    }
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
    name
    imageId
  }

  fragment useIsVerifiedBookAuthor_user on User {
    verifications {
      isBookAuthor
      __typename
    }
    __typename
    id
  }

  fragment CollectionMenuItem_collection on Collection {
    id
    name
    avatar {
      id
      __typename
    }
    ...collectionUrl_collection
    __typename
  }

  fragment collectionUrl_collection on Collection {
    id
    domain
    slug
    __typename
  }

  fragment useIsReactivateMembershipVisible_membershipStatus on MembershipStatus {
    isCancelled
    paymentProvider
    paymentMethod {
      __typename
    }
    __typename
  }

  fragment useCanSwitchMembershipPlan_membershipStatus on MembershipStatus {
    paymentProvider
    isCancelled
    paymentFailedAt
    __typename
  }
`;

export const useUser = () => {
  const { loading, error, data } = useQuery(GET_USER_INFO);
  const [user, setUser] = useState({})

  useEffect(()=>{
    if (!data) return
    console.log('data: ', data)

    setUser({
      username: data.viewer.username,
      id: data.viewer.id,
      name: data.viewer.name,
      imageId: data.viewer.imageId,
    })
  }, [data])

  return {
    loading,
    error,
    user
  }
}
