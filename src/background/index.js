import { ApolloClient, InMemoryCache } from "@apollo/client";
import {GET_USER_INFO} from '../queries/getUserInfo';
import { GET_STATS } from "../queries/getStats.js";
import {calculateEarnings} from "../utils/index.js";

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
    }).then((list) => {

      const totals = list.reduce((acc, post) => ({
        reads: acc.reads + (post.reads || 0),
        views: acc.views + (post.views || 0),
        claps: acc.claps + (post.clapCount || 0),
        responses: acc.responses + (post.postResponses || 0),
        income: acc.income + calculateEarnings(post.earnings?.total)
      }), {reads: 0, views: 0, earnings: 0, claps: 0, responses: 0, income: 0});

      return {
        list,
        totals
      }
    })
}
