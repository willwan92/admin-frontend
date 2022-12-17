## 简介

本项目基于 [Vue3.0](https://github.com/vuejs/vue-next)、[Vite](https://github.com/vitejs/vite)、 [Naive UI](https://www.naiveui.com/)和[TypeScript](https://www.typescriptlang.org/) 开发，使用了最新的前端技术栈，并提炼了典型的业务模型，页面，包括二次封装组件、动态菜单、权限校验、粒子化权限控制等功能。


## 开发环境准备

- 安装nodejs

nodejs获取地址：[node](http://nodejs.org/)

- 安装yarn

```bash
npm install -g yarn
```


## 项目运行

- 安装依赖

```bash
yarn install
```

- 运行

```bash
yarn dev
```

## 项目部署

1. 打包：进入项目根目录，执行如下命令

```bash
yarn build
```

2. 将打包好的dist文件夹压缩成dist.zip包
3. 通过ssh登录到服务器，使用`sudo su`切换到root用户
4. 进入部署目录（/usr/local/var/html），通过命令 `rz -y` 将dist.zip上传到部署目录
通过`unzip dist.zip`解压压缩包，部署完成。


## 开发依赖文档

- [node](http://nodejs.org/) 和 [git](https://git-scm.com/) -项目开发环境
- [Vite](https://vitejs.dev/) - 熟悉 vite 特性
- [Vue3](https://v3.vuejs.org/) - 熟悉 Vue 基础语法
- [TypeScript](https://www.typescriptlang.org/) - 熟悉`TypeScript`基本语法
- [Es6+](http://es6.ruanyifeng.com/) - 熟悉 es6 基本语法
- [Vue-Router-Next](https://next.router.vuejs.org/) - 熟悉 vue-router 基本使用
- [Naive-ui](https://www.naiveui.com/) - ui 基本使用


## 项目目录

├── build # 打包脚本相关

│   ├── script # 脚本

│   └── vite # vite配置

├── public # 公共静态资源目录

├── src # 主目录

│   ├── api # 接口文件

│   ├── assets # 资源文件

│   │   ├── icons # icon sprite 图标文件夹

│   │   ├── images # 项目存放图片的文件夹

│   ├── components # 公共组件

│   ├── directives # 指令

│   ├── enums # 枚举/常量

│   ├── hooks # hook

│   │   ├── core # 基础hook

│   │   ├── event # 事件相关hook

│   │   ├── setting # 配置相关hook

│   │   └── web # web相关hook

│   ├── layouts # 布局文件

│   ├── main.ts # 主入口

│   ├── router # 路由配置

│   ├── settings # 项目配置

│   │   ├── animateSetting.ts # 动画配置

│   │   ├── componentSetting.ts # 组件配置

│   │   ├── designSetting.ts # 样式配置

│   │   ├── projectSetting.ts # 项目配置

│   ├── store # 数据仓库

│   ├── utils # 工具类

│   └── views # 页面

├── types # 类型文件

├── vite.config.ts # vite配置文件



## 浏览器支持

本地开发推荐使用`Chrome 80+` 浏览器

支持现代浏览器, 不支持 IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: | :-: |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

