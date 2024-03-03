let isUpdateStatsTable = false;
console.info('contentScript is running')

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "your_message" ) {
      console.log("Message received in content script", request.data, isUpdateStatsTable);
      // Perform your action here
      if (!isUpdateStatsTable && request.data?.length) {
        console.log('------', request.data)
        isUpdateStatsTable = true;
        updateStatsTable(request.data);
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

    if (!post && !post?.views) {
      return;
    }

    addColumnToTableRow(row, getReadRatio(post?.reads, post?.views), index);
    addColumnToTableRow(row, post.clapCount, index);
    addColumnToTableRow(row, post.postResponses, index);
  })
}

function addColumnToTableHead(table, title) {
  const thead = table.querySelector('thead');
  const tr = thead.querySelector('tr');
  const theLastTh = tr.querySelector('th:last-child');
  const classesFromTheLastTh = theLastTh.getAttribute('class');
  const th = document.createElement('th');

  th.classList.add(...classesFromTheLastTh.split(' '));
  th.innerHTML = title;
  tr.appendChild(th);
}

function addColumnToTableRow(row, value, index = -1) {
  const td = document.createElement('td');
  const lastTdClasses = row.querySelector('td:last-child').getAttribute('class');
  td.classList.add(...lastTdClasses.split(' '));

  const a = document.createElement('a');
  const lastAClasses = row.querySelector('td:last-child a').getAttribute('class');
  a.classList.add(...lastAClasses.split(' '));

  const div = document.createElement('div');
  const lastDivClasses = row.querySelector('td:last-child a div').getAttribute('class');
  div.classList.add(...lastDivClasses.split(' '));

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

function getReadRatio(reads = 0, views = 0) {
  const ratio = ((reads / views) * 100).toFixed(1);
  return `${ratio}%`;
}
