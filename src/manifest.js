import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json' assert { type: 'json' }

const isDev = process.env.NODE_ENV == 'development'

export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? ` ➡️ Dev` : ''}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  host_permissions: [
    "https://medium.com/",
    "https://cdn-images-1.medium.com/",
    "https://extension-tips.glitch.me/*"
  ],
  icons: {
    16: 'img/favicon-16x16.png',
    32: 'img/favicon-32x32.png',
    48: 'img/favicon-48x48.png',
    128: 'img/favicon-128x128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/favicon-48x48.png',
  },
  // options_page: 'options.html',
  // devtools_page: 'devtools.html',
  background: {
    service_worker: 'src/background/index.js',
    type: 'module',
  },
  content_scripts: [
    {
      matches: [
        "https://*.medium.com/*/stats*",
        "https://medium.com/*/stats*"
      ],
      exclude_matches: [
        "https://*.medium.com/*/stats/post*",
        "https://medium.com/*/stats/post*"
      ],
      js: ['src/contentScript/homeStats.js'],
      css: ['src/contentScript/homeStats.css']
    },
  ],
  // side_panel: {
  //   default_path: 'sidepanel.html',
  // },
  web_accessible_resources: [
    {
      resources: ['img/favicon-16x16.png', 'img/favicon-32x32.png', 'img/favicon-48x48.png', 'img/favicon-128x128.png'],
      matches: [],
    },
    {
      resources: ['src/contentScript/homeStats.css'],
      matches: [],
    }
  ],
  permissions: ['activeTab', 'storage'],
  // chrome_url_overrides: {
  //   newtab: 'newtab.html',
  // },
})
