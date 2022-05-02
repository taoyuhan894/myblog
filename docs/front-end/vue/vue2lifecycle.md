---
title: Vue2生命周期浅析
date: 2022-04-11
tags: 
  - 生命周期
  - Vue2
author: Baymax 
---
## vue2生命周期图
![](https://myblog-1301795258.cos.ap-guangzhou.myqcloud.com/blogimg/lifecycle.png)
```html
<div id="app">
  <div class="demo">{{ msg }}</div>
</div>

<script>
  new Vue({
    el: '#app',
    data: {
      msg: 'ok'
    },
    methods: {
      show() {
        console.log('show')
      }
    },
    // 此时只有Events和生命周期函数初始化完毕
    beforeCreate() {
      // console.log(this.msg) // undefined
    },
    // 访问data中的属性和methods中方法最早只能在created中访问
    created() {
      // console.log(this.msg) // ok
      // console.log(document.querySelector('.demo').innerHTML) // {{ msg }}
    },
    beforeMount() {
      console.log(document.querySelector('.demo').innerHTML) // {{ msg }}
    },
    mounted() {
      console.log(document.querySelector('.demo').outerHTML) // <div class="demo">ok</div>
    }
  })
  </script>
```
