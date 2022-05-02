---
title: Vue2-渲染函数&JSX
date: 2022-04-15
tags: 
  - JSX
  - Vue2
  - 渲染函数
author: Baymax 
---
## 使用
在特定情况下使用render函数创建html更加方便，具体参考官网：[渲染函数&JSX](https://cn.vuejs.org/v2/guide/render-function.html#%E5%9F%BA%E7%A1%80)<br />使用JSX语法需要先安装相关插件：<br />`npm install -D @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props`<br />**_babel.config.js_**中加入以下配置： 
```javascript
module.exports = {
  presets: ['@vue/babel-preset-jsx']
}
```
使用语法：[jsx-vue2](https://github.com/vuejs/jsx-vue2#installation)
## js文件的写法
MyHeader.js
```javascript
import Vue from 'vue'
Vue.component('my-header', {
  props: {
    level: 1
  },
  created() {
    console.log('my-header')
  },
  render(h) {
    return (
      <div>{this.$props.level}</div>
    )
  }
})
```
需要用到的地方import导入即可使用。
## 单文件组件写法
子组件
```vue
<script>
export default {
  props: {
    name: {
      type: String,
      default: 'myName'
    }
  },
  data() {
    return {
      msg: 'Msg'
    }
  },
  render(h) {
    return (
      <div>
        <p class="title">我是子组件的JSX</p>
        <p>{ this.msg }</p>
        <p>{ this.name }</p>
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 30px;
  color: red;
}
</style>
```
父组件
```vue
<script>
import JsxChild from '@/components/JsxChild.vue'

export default {
  components: {
    JsxChild
  },
  data() {
    return {
      name: '我是父组件的name',
      inputValue: ''
    }
  },
  methods: {
    clickMe() {
      console.log('click-me')
    }
  },
  render(h) {
    return (
      <div>
        <p>我是父元素的Jsx</p>
        <jsx-child name={ this.name }></jsx-child>
        <div
          class="click-me"
          vOn:click={ this.clickMe }>
          点击我
        </div>
        <p>我是input框中输入的内容：{ this.inputValue }</p>
        <input
          value={ this.inputValue }
          onInput={ (e) => this.inputValue = e.target.value }>
        </input>
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
.click-me {
  width: 100px;
  height: 100px;
  background-color: red;
  cursor: pointer;
}
</style>
```
