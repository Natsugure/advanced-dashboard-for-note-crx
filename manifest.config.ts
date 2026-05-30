import { defineManifest } from '@crxjs/vite-plugin'

const isDev = process.env.NODE_ENV !== 'production'

export default defineManifest({
  manifest_version: 3,
  name: 'Advanced Dashboard for note',
  version: '1.0.0',
  description: '',

  ...(isDev && {
    content_security_policy: {
      extension_pages: "script-src 'self' http://localhost:4000; object-src 'self'",
    },
  }),

  permissions: [
    'storage',
    'activeTab'
  ],

  host_permissions: [
    'https://note.com/*'
  ],

  action: {
    default_popup: 'index.html',
    // default_icon: {
    //   '16': 'icon16.png',
    //   '48': 'icon48.png',
    //   '128': 'icon128.png'
    // }
  },

  // options_ui: {
  //   page: 'options.html',
  //   open_in_tab: true
  // },

  // background: {
  //   service_worker: 'src/background/index.ts',
  //   type: 'module'
  // },

  // content_scripts: [
  //   {
  //     matches: ['https://note.com/*'],
  //     js: ['src/content/index.tsx'],
  //     run_at: 'document_start'
  //   }
  // ],

  // icons: {
  //   '16': 'icon16.png',
  //   '48': 'icon48.png',
  //   '128': 'icon128.png'
  // }
})