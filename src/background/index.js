import { ApolloClient, InMemoryCache } from "@apollo/client";
import {GET_USER_INFO} from '../queries/getUserInfo';
import { GET_STATS } from "../queries/getStats.js";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://medium.com/_/graphql',
});

console.log('background is running')


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_USER') {
    console.log('try to get user')
    handleGetUser().then(sendResponse);
    return true;
  }

  if (request.type === 'GET_STATS') {
    console.log('try to get stats', request.username)
    handleGetStats({username: request.username}).then(sendResponse);
    return true;
  }

  return true;
})

function handleGetUser() {
  return client
  .query({
    query: GET_USER_INFO,
  }).then(({data})=> {
    console.log('data;;;;: ', data)
    return {
      username: data.viewer.username,
      id: data.viewer.id,
      name: data.viewer.name,
      imageId: data.viewer.imageId,
    }
  })
}

function handleGetStats({username}) {
  return client
    .query({
      variables: {
        username,
        first: 100,
        after: "",
        orderBy: null,
        filter: null
      },
      query: GET_STATS,
    }).then(({data}) => {
      return data.user.postsConnection.edges.map(edge => {
        const node = edge.node || {};
        return ({
          clapCount: node.clapCount,
          id: node.id,
          postResponses: node.postResponses?.count,
          readingTime: node.readingTime,
          reads: node.totalStats?.reads,
          views: node.totalStats?.views,
          slug: node.uniqueSlug,
          earnings: node?.earnings
        })
      })
    })
}
