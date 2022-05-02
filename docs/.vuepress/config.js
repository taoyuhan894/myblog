module.exports = {
  title: 'Baymax',
  base: './',
  description: 'Baymax的技术积累中心',
  plugins: [
    '@vuepress/active-header-links',
    '@vuepress/back-to-top',
    '@vuepress/medium-zoom'
  ],
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    nav: [
      // 技术库
      {
        text: '个人知识库',
        link: '/front-end/'
      },
      // 技术文档
      {
        text: '技术文档',
        items: [
          {
            text: '前端',
            items: [
              { text: 'mdn', link: 'https://developer.mozilla.org/zh-CN/' },
              { text: 'npm', link: 'https://www.npmjs.com/' },
              { text: 'tailwindcss', link: 'https://www.tailwindcss.cn/' },
            ]
          },
          {
            text: 'node',
            items: [
              { text: 'express', link: 'https://www.expressjs.com.cn/' },
              { text: 'koa', link: 'https://koa.bootcss.com/' },
              { text: 'egg', link: 'https://www.eggjs.org/zh-CN' },
            ]
          },
          {
            text: '数据库',
            items: [
              { text: 'mongoose', link: 'http://mongoosejs.net/' },
              { text: 'sequelize', link: 'https://www.sequelize.com.cn/' },
            ]
          }
        ]
      },
      // 软件工具
      // {
      //   text: '软件工具',
      //   items: [
      //     { text: 'vscode' }
      //   ]
      // },
      // 项目源码
      {
        text: '项目源码',
        items: [
          { text: '校友信息管理系统', link: 'https://gitee.com/tao-yuhan/xiaoyou' },
          { text: '党建微信小程序', link: 'https://gitee.com/tao-yuhan/dangjian' },
        ]
      },
      // 关于我
      {
        text: '关于我',
        items: [
          { text: 'CSDN', link: 'https://blog.csdn.net/Wind_AN' },
          { text: 'gitee', link: 'https://gitee.com/tao-yuhan' },
          { text: 'github', link: 'https://github.com/taoyuhan894' }
        ]
      }
    ],
    sidebar: [
      {
        title: '前端技术库',
        children: [
          {
            title: 'HTML',
            children: []
          },
          {
            title: 'CSS',
            children: [
              '/front-end/css/css3base',
            ]
          },
          {
            title: 'JavaScript',
            children: [
              '/front-end/javascript/this',
              '/front-end/javascript/clone',
            ]
          },
          {
            title: '网络基础',
            children: [
              '/front-end/netword-base/cna',
              '/front-end/netword-base/safety',
              '/front-end/netword-base/cross',
            ]
          },
          {
            title: '移动端开发',
            children: []
          },
          {
            title: 'Vue技术栈',
            children: [
              '/front-end/vue/vue2lifecycle',
              '/front-end/vue/vue2reactive',
              '/front-end/vue/Vue2-JSX',
              '/front-end/vue/Vue3',
            ]
          },
          {
            title: 'Git',
            children: [
              '/front-end/git/git-base'
            ]
          },
          {
            title: 'React技术栈',
            children: [
              '/front-end/react/react'
            ]
          },
        ]
      }
    ]
  }
}