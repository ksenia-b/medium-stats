let isUpdateStatsTable = false;
console.info('contentScript is running')
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "your_message" ) {
      console.log("Message received in content script", request.data);
      // Perform your action here
      if (!isUpdateStatsTable) {
        updateStatsTable(request.data);
        isUpdateStatsTable = true;
      }

    }
  }
);


function updateStatsTable(data) {
  if (!data) {
    return;
  }
  const table = document.querySelector('table');

  if(!table) {
    return;
  }

  addColumnToTableHead(table, 'Read ratio');
  addColumnToTableHead(table, 'Claps');
  addColumnToTableHead(table, 'Responses');

  const rows = table.querySelectorAll('tbody tr');
  rows.forEach((row, index) => {
    console.log('row: ', row);
    const postId = getPostId(getFirstLinkHref(row));
    console.log('postId: ', postId);
    const post = data.find(post => post.id === postId);

    addColumnToTableRow(row, getReadRatio(post.reads, post.views), index);
    addColumnToTableRow(row, post.clapCount, index);
    addColumnToTableRow(row, post.postResponses, index);
  })
}

function addColumnToTableHead(table, title) {
  const thead = table.querySelector('thead');
  const tr = thead.querySelector('tr');
  const th = document.createElement('th');
  th.classList.add('be', 'b', 'bf', 'z', 'cj', 'ji', 'jm', 'jp', 'uf');
  th.innerHTML = title;
  tr.appendChild(th);
}

function addColumnToTableRow(row, value, index = -1) {
  const td = document.createElement('td');
  td.classList.add('am');

  const a = document.createElement('a');
  a.classList.add('af', 'ag', 'ah', 'ai', 'aj', 'ak', 'al', index === 0 ? 'mi' : 'nx', 'an', 'ao', 'ap', 'aq', 'ar', 'as', 'at', 'jo', 'jn', 'jq', 'jp', 'cl', 'l');

  const div = document.createElement('div');
  div.classList.add('be', 'b', 'nu', 'nv', 'bj', 'nw');

  div.innerHTML = value;
  a.appendChild(div);
  td.appendChild(a);
  row.appendChild(td);
}

function getPostId(urlString) {
  const url = new URL(urlString);
  const pathSegments = url.pathname.split('/');
  const postIndex = pathSegments.indexOf('post');
  return pathSegments[postIndex + 1];
}

function getFirstLinkHref(row) {
  const link = row.querySelector('a');
  return link ? link.href : null;
}

function getReadRatio(reads, views) {
  const ratio = ((reads / views) * 100).toFixed(1);
  return `${ratio}%`;
}
