import { TOTALS } from "../constants";
import { currencyFormatter} from "../utils/";

function updateStatsTable(data) {
  if (!data) {
    return;
  }
  const table = document.querySelector('table');

  if (!table) {
    return;
  }

  const interval = setInterval(function waitForTableAppears() {
    let rows = table.querySelectorAll('tbody tr');
    const firstRow = rows[0];
    const isTableRenderedAndLinksToArticlesAdded = getFirstLinkHref(firstRow);

    if (isTableRenderedAndLinksToArticlesAdded) {
      clearInterval(interval);
      getNotUpdatedRows(data);
    }
  }, 500);
}

const getNotUpdatedRows = (data) => {
  setInterval(() => {
    const rows = document.querySelectorAll('table tbody tr:not(.updated)');
    if (rows.length) {
      updateTableRows(rows, data);
    }
  }, 1000);
}

const updateTableRows = (rows,data) => {
  rows.forEach((row, index) => {
    const postId = getPostId(getFirstLinkHref(row));
    const post = data.find(post => post.id === postId);

    if (!post && !post?.views) {
      return;
    }

    addColumnToTableRow(row, getReadRatio(post?.reads, post?.views), 'Read ratio');
    addColumnToTableRow(row, post.clapCount, 'Claps');
    addColumnToTableRow(row, post.postResponses, 'Responses');

    row.classList.add('updated');
  })
}

function addColumnToTableRow(row, value, label) {
  const tdToClone = row.querySelector('td:nth-child(3)');
  const clonedTd = tdToClone.cloneNode(true);

  const valueDiv = clonedTd.querySelector('a > div > div:first-child p');
  const labelDiv = clonedTd.querySelector('a > div > div:last-child p');

  valueDiv.innerHTML = value;
  labelDiv.textContent = label;

  row.appendChild(clonedTd);
}

function getPostId(urlString) {
  if (!urlString) {
    return null
  }
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
  if (views === 0) {
    return '0%';
  }

  const ratio = ((reads / views) * 100)?.toFixed(1);
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
  const wrapper = document.createElement('div');
  wrapper.classList.add('lifetime-totals');

  for (let key in TOTALS) {
    const titleContentDiv = document.createElement('div');

    const value = document.createElement('h2');
    value.textContent = key === 'income' ? currencyFormatter(totals[key]) : totals[key];

    const label = document.createElement('div');
    label.textContent = TOTALS[key] || key;

    titleContentDiv.appendChild(value);
    titleContentDiv.appendChild(label);

    wrapper.appendChild(titleContentDiv);
  }

  const lifetime = findElementByContent('Lifetime');
  const parent = lifetime.parentNode.parentNode;

  parent.parentNode.insertBefore(wrapper, parent.nextSibling);
}

(async () => {
  const user = await chrome.runtime.sendMessage({ type: 'GET_USER' });
  const stats = await chrome.runtime.sendMessage({ type: 'GET_STATS', username: user?.username });

  updateStatsTable(stats?.list)
  buildLifetimeTotals(stats?.totals)
})();
