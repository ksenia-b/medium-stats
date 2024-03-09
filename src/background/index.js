import { ApolloClient, InMemoryCache } from "@apollo/client";
import {GET_USER_INFO} from '../queries/getUserInfo';
import { GET_STATS } from "../queries/getStats.js";
import { GET_DAILY_INCOME } from './../queries/getDailyIncome';
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

  if (request.type === 'GET_DAILY_INCOME') {
    console.log('try to get daily income', request.posts);
    const postsWithIncome = request?.posts?.filter((post) => post.income);

    console.log('postsWithIncome: ', postsWithIncome)

    handleGetDailyIncome({posts: postsWithIncome}).then(sendResponse);
    return true;
  }

  return true;
})

function handleGetDailyIncome({posts}) {
  console.log('posts: ', posts)
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const endAt = new Date().getTime();

  const incomePromises = posts.map(post => {
    const startAt = post.firstPublishedAt - ONE_DAY;
    return fetchIncomeForPost({postId: post.id, startAt, endAt});
  });

  return Promise.all(incomePromises)
    .then(incomeArray => {
      // incomeArray is an array of the resolved values of the promises
      console.log('incomeArray: ', incomeArray);
      return incomeArray;
    });

}

function fetchIncomeForPost({postId, startAt, endAt}) {
  return client
    .query({
      query: GET_DAILY_INCOME,
      variables: {
        postId,
        startAt,
        endAt,
      }
    }).then(({data})=> {
      return {
        data: data?.post?.earnings?.dailyEarnings || [],
        postId: data?.post?.id
      }
    })
}


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
          earnings: node?.earnings,
          income: calculateEarnings(node?.earnings?.total),
          firstPublishedAt: node?.firstPublishedAt,
          title: node?.title,
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
