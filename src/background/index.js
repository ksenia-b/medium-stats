import { ApolloClient, InMemoryCache } from "@apollo/client";
import {GET_USER_INFO} from '../queries/getUserInfo';
import { GET_STATS } from "../queries/getStats.js";
import { GET_DAILY_INCOME } from '../queries/getDailyIncome';
import { GET_MONTHLY_STATS_READS_VIEWS } from '../queries/getMonthlyStatsReadsViews.js';
import { GET_POST_STATS_DAILY_BUNDLE } from '../queries/getPostStatsDailyBundle.js';
import { MAX_RECURSION_DEPTH, LOCAL_STORAGE_TIME } from '../constants.js';
import { countStoriesByFields, calculateEarnings, convertTimestampToDate } from '../utils';

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
    handleGetStatsWithCache({username: request.username}).then(sendResponse);
    return true;
  }

  if (request.type === 'GET_DAILY_INCOME') {
    const postsWithIncome = request?.posts?.filter((post) => post.income);
    const { username } = request;

    handleGetDailyIncomeWithCache({posts: postsWithIncome, username}).then(sendResponse);
    return true;
  }

  if (request.type === 'GET_MONTHLY_STATA_READS_VIEWS') {
    console.log('GET_MONTHLY_STATA_READS_VIEWS');

    const { username, startTime, endTime} = request;

    handleGetMonthlyStatsReadsView({username, startTime, endTime}).then(sendResponse);
    return true;
  }

  if (request.type === 'GET_POST_STATS_DAILY_BUNDLE') {
    const { postsIds, startTime, endTime} = request;

    handleGetAllPostsStatsDailyBundle({postsIds, startTime, endTime}).then(sendResponse);
    return true;
  }

  return true;
})

async function handleGetDailyIncomeWithCache({posts, username}) {
  const cacheKey = `dailyIncome-${username}`;

  try {
    const cachedData = await chrome.storage.local.get([cacheKey]);

    if (cachedData && cachedData[cacheKey]) {
      const { data, timestamp } = cachedData[cacheKey];
      const threeHoursAgo = Date.now() - LOCAL_STORAGE_TIME;

      if (timestamp > threeHoursAgo) {
        return data;
      }
    }
  } catch (e) {
    console.log('Failed to get data [dailyIncome] from cache', e)
  }

  const data = await handleGetDailyIncome({posts});

  chrome.storage.local.set({[cacheKey]: {
      data,
      timestamp: Date.now()
    }});

  return data;
}

function handleGetMonthlyStatsReadsView({username, startTime, endTime}) {
  if (!startTime || !endTime) {
    return Promise.resolve([]);
  }

  return client
    .query({
      variables: {
        username,
        input: {
          startTime,
          endTime
        }
      },
      query: GET_MONTHLY_STATS_READS_VIEWS,
    }).then(({data}) => {
      return data.user.postsAggregateTimeseriesStats.points.map(point => {
        return {
          timestamp: point.timestamp,
          views: point.stats.total.viewers,
          reads: point.stats.total.readers,
        }
      })
    })
}

async function handleGetAllPostsStatsDailyBundle({postsIds, startTime, endTime}) {
  let results = {};

  // intentionally not using Promise.all to avoid hitting the rate limit
  for (const postId of postsIds) {
    const data = await handleGetPostStatsDailyBundleWithCache({postId, startTime, endTime});
    results[postId] = data;
  }

  return results;
}

function handleGetPostStatsDailyBundle({postId, startTime, endTime}) {
  if (!startTime || !endTime) {
    return Promise.resolve([]);
  }

  return client
    .query({
      variables: {
        postStatsDailyBundleInput: {
          fromDayStartsAt: startTime,
          toDayStartsAt: endTime,
          postId
        }
      },
      query: GET_POST_STATS_DAILY_BUNDLE
    }).then(({data}) => {
      return data?.postStatsDailyBundle?.buckets;
    })
}

async function handleGetPostStatsDailyBundleWithCache({postId, startTime, endTime}) {
  const cacheKey = `postBundle-${postId}`;

  try {
    const cachedData = await chrome.storage.local.get([cacheKey]);

    if (cachedData && cachedData[cacheKey]) {
      const { data, timestamp } = cachedData[cacheKey];
      const threeHoursAgo = Date.now() - LOCAL_STORAGE_TIME * 3;

      if (timestamp > threeHoursAgo) {
        return data;
      }
    }
  } catch (e) {
    console.log('Failed to get data [dailyIncome] from cache', e)
  }

  const data = await handleGetPostStatsDailyBundle({postId, startTime, endTime});

  chrome.storage.local.set({[cacheKey]: {
      data,
      timestamp: Date.now()
    }});

  return data;
}

function handleGetDailyIncome({posts}) {
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const today = new Date();
  today.setHours(0,0,0,0);
  const endAt = today.getTime();

  const incomePromises = posts.map(post => {
    const startAt = post.firstPublishedAt - ONE_DAY;
    return fetchIncomeForPost({postId: post.id, startAt, endAt});
  });

  return Promise.all(incomePromises)
    .then(incomeArray => {
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
    return {
      username: data.viewer?.username,
      id: data.viewer?.id,
      name: data.viewer?.name,
      imageId: data.viewer?.imageId,
    }
  })
}

async function handleGetStatsWithCache({username}) {
  try {
    const cachedData = await chrome.storage.local.get([username]);

    if (cachedData && cachedData[username]) {
      const { data, timestamp } = cachedData[username];
      const threeHoursAgo = Date.now() - LOCAL_STORAGE_TIME;

      if (timestamp > threeHoursAgo) {
        return data;
      }
    }
  } catch (e) {
    console.log('Failed to get data from cache', e)
  }

  const data = await handleGetStats({username});

  chrome.storage.local.set({[username]: {
      data,
      timestamp: Date.now()
    }});

  return data;
}

async function handleGetStats({username, after = "", depth = 0}) {
  const { data } = await client.query({
    variables: {
      username,
      first: 100,
      after,
      orderBy: null,
      filter: null
    },
    query: GET_STATS,
  });

  const list = data.user?.postsConnection?.edges?.map(edge => {
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
      visibility: node?.visibility,
    });
  });

  const totals = list?.reduce((acc, post) => ({
    reads: acc.reads + (post.reads || 0),
    views: acc.views + (post.views || 0),
    claps: acc.claps + (post.clapCount || 0),
    responses: acc.responses + (post.postResponses || 0),
    income: acc.income + calculateEarnings(post.earnings?.total)
  }), {reads: 0, views: 0, earnings: 0, claps: 0, responses: 0, income: 0});

  const pageInfo = data.user?.postsConnection?.pageInfo;
  const nextPageData = pageInfo?.hasNextPage && depth < MAX_RECURSION_DEPTH
    ? await handleGetStats({username, after: pageInfo.endCursor, depth: depth + 1})
    : { list: [], totals: { reads: 0, views: 0, claps: 0, responses: 0, income: 0 } };

  return {
    list: [...list, ...nextPageData.list],
    totals: {
      reads: totals.reads + nextPageData.totals.reads,
      views: totals.views + nextPageData.totals.views,
      claps: totals.claps + nextPageData.totals.claps,
      responses: totals.responses + nextPageData.totals.responses,
      income: totals.income + nextPageData.totals.income,
      stories: list.length,
    },
    totalsDetails: {
      stories: countStoriesByFields(list),
    }
  };
}
