import { defineManifest } from '@crxjs/vite-plugin'
import { version } from '../package.json'

// NOTE: do not include src/ in paths,
// vite root folder: src, public folder: public (based on the project root)
// @see ../vite.config.ts#L16

const manifest = defineManifest(async (env) => ({
  manifest_version: 3,
  name: `${env.mode === 'development' ? '[Dev] ' : ''}AWS account name visualizer`,
  description:
    'Visualizing current AWS account name for easier navigation in Control Tower environments.',
  version,
  // background: {
  //   service_worker: 'background/index.ts',
  // },
  content_scripts: [
    {
      // matches: ['http://*/*', 'https://*/*', 'file:///*'],
      matches: ['https://*.console.aws.amazon.com/*'],
      js: ['content/index.tsx'],
    },
  ],
  // host_permissions: ['<all_urls>'],
  // web_accessible_resources: [
  //   {
  //     resources: [
  //       // this file is web accessible; it supports HMR b/c it's declared in `rollupOptions.input`
  //       'welcome/welcome.html',
  //     ],
  //     matches: ['<all_urls>'],
  //   },
  // ],
  action: {
    default_popup: 'popup/popup.html',
    default_icon: {
      '16': 'images/logo/extension_16.png',
      '32': 'images/logo/extension_32.png',
      '48': 'images/logo/extension_48.png',
      '128': 'images/logo/extension_128.png',
    },
  },
  icons: {
    '16': 'images/logo/extension_16.png',
    '32': 'images/logo/extension_32.png',
    '48': 'images/logo/extension_48.png',
    '128': 'images/logo/extension_128.png',
  },
  permissions: ['storage'],
}))

export default manifest
