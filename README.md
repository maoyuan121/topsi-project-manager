# Topsi Project Manager

Topsi Project Manager 是一个使用 Electron 和 Vue.js 构建的简单的项目看板软件。支持 3 个主流的平台（Windows, Linux and macOS）。

该软件是开源且免费的。开源协议是 AGPLv3。

## Version 0.1

## 功能

### 不需要网络，不需要注册。

![No Internet required, no registration needed](https://user-images.githubusercontent.com/2964165/44611105-6e920e00-a7cd-11e8-99d3-fa9d172e1fd7.png)

### 简单的看板

![Simple Kanban board](https://user-images.githubusercontent.com/2964165/44611113-7b166680-a7cd-11e8-8909-077bd7ec87c7.png)

### 用里程碑将 notes 组织在一起

![Organize your notes in multiple milestones](https://user-images.githubusercontent.com/2964165/44611155-ad27c880-a7cd-11e8-89fa-acf0dea717cb.png)

### 支持拖放

![Drag & drop notes](https://user-images.githubusercontent.com/2964165/44611998-c1ba8f80-a7d2-11e8-9675-30ac9bc203e4.gif)

### 标签

![Tags](https://user-images.githubusercontent.com/2964165/44611830-b6b32f80-a7d1-11e8-91d3-66175c503978.gif)

### 通过 note 的标题和标签进行搜索

![Search for notes by title or tag](https://user-images.githubusercontent.com/2964165/44611789-63d97800-a7d1-11e8-9410-cef3776b779b.gif)

### 图片附件

![Image attachment](https://user-images.githubusercontent.com/2964165/44611858-de09fc80-a7d1-11e8-90a1-f0b3a695e108.gif)

### 导入 & 导出项目（使用 JSON 格式）

![Export and import projects (in JSON format)](https://user-images.githubusercontent.com/2964165/44611163-b87af400-a7cd-11e8-8364-1424e3d24682.png)

### 字定义主题颜色

![Dark mode & customization](https://user-images.githubusercontent.com/2964165/44612138-e95e2780-a7d3-11e8-84b5-96533faf9888.gif)

### 100% 免费 & 100% 开源

## 路线

`master` 分支用于开发阶段，一旦构建了一个稳定版（当前是 alpha 版），将在 release 页面看到更新和可执行文件。  
下一步将实现下面的功能：

- 提供除了 English 外的其他语言包
- 快捷键
- 更好的图片附件（目前用的会使得应用变慢）
- 评论
- 插件系统
- 更好的里程碑管理
- 文件附件
- Undo / Redo
- Synchronize with GitHub and GitLab issues
  - 从 GitHub/GitLab 导入 issue
  - Local changes are
- 重构
- 用户
- Updates

## Build

```bash
# 克隆项目
git clone https://github.com/Physiix/topsi-project-manager

# 安装依赖包（你也可以使用 npm）
yarn

# 以开发模式运行
yarn run dev

# 编译可执行文件
yarn build
```

## 贡献

欢迎所有的贡献：修改拼写错误、翻译、报告 Bug、贡献代码、写文档等

## 该项目使用的框架

- Electron - 一款利用 Web 技术开发跨平台桌面应用的框架
- Vue.js - 前端框架
- Vuetify - Vue 的控件库
- Quill - 编辑器
- Sortable - 拖放排序
- lowdb - 本地 JSON 数据库（支持 Node、Electron 和浏览器）

## License

AGPLv3
