import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "AfterTicket",
  description: "The sole official technical documentation for AfterTicket",
  head: [
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css' }],
  ],
  vite: {
    server: {
      proxy: {
        '/api/v1': {
          target: 'https://updater.afterticket.org',
          changeOrigin: true,
        },
      },
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '下载', link: '/download' },
    ],

    sidebar: [
      {
        text: '下载',
        items: [
          { text: '下载客户端', link: '/download' },
        ]
      },
      {
        text: '使用用例',
        items: [
          { text: 'Linux 服务器一键部署', link: '/use-cases/linux-server-deploy' },
        ]
      },
      {
        text: '法律文件',
        items: [
          { text: '用户协议', link: '/policy/user-agreement' },
          { text: '隐私政策', link: '/policy/privacy' },
          { text: '版权投诉政策', link: '/policy/copyright' },
          { text: '可接受使用政策', link: '/policy/acceptable-use' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Nexaorion/AfterTicket-Docs' }
    ],

    footer: {
      message: '使用 AfterTicket 前请完整阅读相关法律文件',
      copyright: 'Copyright © 2026-present AfterTicket Team'
    },
    search: {
      provider: 'local'
    }
  }
})
