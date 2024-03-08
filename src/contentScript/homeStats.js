
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
    console.log('row: ', row, getFirstLinkHref(row));

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

function findElementByContent(content) {
  const h2Elements = document.getElementsByTagName('h2');
  for(let i = 0; i < h2Elements.length; i++) {
    if(h2Elements[i].textContent === content) {
      return h2Elements[i];
    }
  }
  return null;
}

function buildLifetimeTotals(totals) {
  const labels = {
    "reads": "Reads",
    "views": "Views",
    "claps": "Claps",
    "responses": "Responses",
    "income": "Earnings"
  }
  const wrapper = document.createElement('div');
  wrapper.classList.add('lifetime-totals');

  for (let key in totals) {
    const titleContentDiv = document.createElement('div');

    const value = document.createElement('h2');
    value.textContent = key === 'income' ? `$${Number(totals[key]).toFixed(1)}` : totals[key];

    const label = document.createElement('div');
    label.textContent = labels[key] || key;

    titleContentDiv.appendChild(value);
    titleContentDiv.appendChild(label);

    wrapper.appendChild(titleContentDiv);
  }

  const lifetime = findElementByContent('Lifetime');
  const parent = lifetime.parentNode;

  parent.parentNode.insertBefore(wrapper, parent.nextSibling);
}


(async () => {
  const user = await chrome.runtime.sendMessage({ type: 'GET_USER' });
  const stats = await chrome.runtime.sendMessage({ type: 'GET_STATS', username: user?.username });


  // console.log('data: ----', user);
  // console.log('stats: ----', stats);

  setTimeout(() => updateStatsTable(stats?.list), 1000);
  buildLifetimeTotals(stats?.totals)


})();
