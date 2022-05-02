---
title: Vue3浅析
date: 2022-04-15
tags: 
  - Vue3
author: Baymax 
---
## 1.认识Vue3

官网：[Vue3](https://v3.cn.vuejs.org/)

Vue3支持Vue2的很多特性，并且能够 更好的支持TypeScript。Vue3在性能上也大大提升，打包大小减少，渲染更快，内存也相对减少。

## 2.创建Vue3项目

### 1.1 vue-cli创建

```bash
npm install -g @vue/cli
## 保证 vue cli 版本在 4.5.0 以上
vue create my-project
```

### 1.2 vite创建

[vite官网](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)

```bash
npm init vite <project-name>
cd <project-name>
npm install
npm run dev
```

## 3.初探Vue3

### 3.1 采用TS后入口文件为main.ts

```typescript
//引入createApp函数,创建对应的应用，产生实例对象
import { createApp } from 'vue'

import App from './App.vue'
//创建App应用并且挂载
createApp(App).mount('#app')
```

### 3.2 Vue3中html模版可以没有根元素

```html
<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
</template>
```

如果是Vue2则需要在一个根标签`<div></div>`

### 3.3 script

```typescript
<script lang="ts">
//defineComponent函数的目的是定义一个组件，所传的配置对象就相当于Vue2的配置对象
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  }
});
</script>
```

## 4.常用Composition API

### 4.1 setup

- setup在生命周期函数 beforeCreate 之前就执行，而且只执行一次，此时组件对象还没有被创建，因此是无法使用this的，this为undefined
- setup尽量不要与data和methods混合使用
- setup参数setup(_props_, { _attrs_, _emit_, _slots_ })
- prop参数是一个对象，里面有父级组件向子级组件传递的数据，并且是在子级组件中使用props接收到的所有属性，子组件不用props接收则里面就没有传递的这个数据
- attrs则是传递了没有接收的数据
- emit：用来分发自定义事件的函数, 相当于 this.$emit
- slots：包含所有传入的插槽内容的对象, 相当于 this.$slots

### 4.2 setup与ref

与Vue2对比,Vue3将。属性值与方法都放在setup中，所有的组合 API 函数都在此使用, 只在初始化时执行一次，而且setup函数如果返回对象，对象中的属性或者方法都可以在模版中使用。

在方法中修改属性的值需要用到num.value，但是在模版中显示该值不需要.value

```typescript
<template>
  {{ num }}
  <button @click="Method1">button</button>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    //如果只是const num = 0;num不是响应式的数据，修改这个数据页面不会发生更改
    const num = ref(0);
    function Method1() {
      console.log(num);
      //通过num.value修改这个属性的值
      num.value ++
    }
    return {
      num,
      Method1
    };
  },
});
</script>
```

### 4.3 reactive

reactive则是定义多个响应式数据，reactive()中传入一个对象，将该对象作为目标对象，生成一个代理对象，如果ref中传入的是一个对象。内部自动转换成reactive代理的对象

```typescript
const person = {
    name: 'aaa',
    age: 12
}
//reactive将person这个对象当成目标对象,user则是代理对象,
//修改person中的值则需要通过user.name,user.age来响应式修改
const user = reactive(person)
```

**注意**：修改、增加、删除对象的属性，想要页面显示的数据也变化，必须在代理对象中进行操作，以上事例就是在user中进行操作，直接修改person中的数据，无法实现页面的更新

### 4.4 计算属性

计算属性通过computed()来实现，传入一个回调函数则之后get方法

```typescript
<template>
  姓：<input type="text" v-model="per.firstName">
  名：<input type="text" v-model="per.lastName">
  姓名：<input type="text" v-model="fullName">
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
export default defineComponent({
  name: "Comp",
  setup() {
    const per = reactive({
      firstName: 't',
      lastName: 'yh'
    })
    //如果computed里面只传一个回调函数，则只能调用get方法
    // const fullName = computed(() => {

    // })
    const fullName = computed({
      get() {
        return per.firstName + per.lastName
      },
      set(val: string) {
        console.log(val)//val的值就是fullName的值
        per.firstName = val
      }
    })
    return {
      per,
      fullName
    }
  },
});
</script>
```

### 4.5 监视器

- 监视单个

```typescript
watch(per,() => {
    fullName2.value = per.firstName + per.lastName
},{immediate: true,deep: true})
//immediate初始化立即执行一次
//deep进行深度监视
```

- 监视多个

`per.firstName`为非响应式数据需要通过回调的方式来监视`() => per.firstName`

```typescript
watch([() => per.firstName, () => per.lastName, fullName3], values => {
    console.log('监视多个数据', values)
})
```

- watchEffect就相当于`watch((),{immediate: true})`初始化立即执行一次

```typescript
watchEffect(() => {
    console.log('watchEffect')
    fullName3.value = user.firstName + '-' + user.lastName
})
```

### 4.6 生命周期

Vue3的生命周期相对于Vue2的生命周期来说，只有`destroyed`和`beforeDestroy`发生改变，以下是2.x到3.x的替换

- beforeCreate -> 使用 setup()
- created -> 使用 setup()
- beforeMount -> onBeforeMount
- mounted -> onMounted
- beforeUpdate -> onBeforeUpdate
- updated -> onUpdated
- beforeDestroy -> onBeforeUnmount
- destroyed -> onUnmounted
- errorCaptured -> onErrorCaptured

Vue3中仍然可以使用Vue2的生命周期函数，但是Vue3中的生命周期函数触发要比Vue2中的快

```typescript
setup() {
    const msg = ref('abc')

    const update = () => {
        msg.value += '--'
    }

    onBeforeMount(() => {
        console.log('--onBeforeMount')
    })

    onMounted(() => {
        console.log('--onMounted')
    })

    onBeforeUpdate(() => {
        console.log('--onBeforeUpdate')
    })

    onUpdated(() => {
        console.log('--onUpdated')
    })

    onBeforeUnmount(() => {
        console.log('--onBeforeUnmount')
    })

    onUnmounted(() => {
        console.log('--onUnmounted')
    })

    return {
        msg,
        update
    }
}
```

### 4.7 自定义hook函数

hook函数就相当与Vue2中mixin，这里写一个请求的函数

在src文件夹下面新建一个文件夹hooks，里面新建useRequest.ts文件

```typescript
import {ref} from "vue"
import axios from "axios"
export default function userUrlLoader(url: string) {
  const result = ref(null)
  const loading = ref(true)
  const errMsg = ref(null)

  axios.get(url).then(response => {
    loading.value = false
    result.value = response.data
  }).catch(e => {
    loading.value = false
    errMsg.value = e.message || "未知错误"
  })
  return {
    result,
    loading,
    errMsg
  }
}
```

在组件中使用hook函数

```typescript
<template>
  <ul>
    <li>{{result.id}}</li>
    <li>{{result.name}}</li>
  </ul>
</template>

<script lang="ts">
import { defineComponent} from "vue";
import useRequest from "../hooks/useRequest";

//定义一个接口
interface App {
  id: number,
  name: string
}
export default defineComponent({
  name: "Hook",
  setup() {
    const {loading, result, errMsg} = useRequest<App>('/data/app.json');
    return {
      loading,
      result,
      errMsg
    }
  },
});
</script>
```

## 5.其它

### 5.1 shallowReactive 与 shallowRef

先给一个对象

```typescript
const per = {
    pname: 'aa',
    stu: {
        sname: 'bb'
    }
}
```

- shallowReactive :只处理pname的响应，stu的name不会发生响应
- shallowRef: 同理
- 什么时候用浅响应式呢? 
   - 一般情况下使用 ref 和 reactive 即可
   - 如果有一个对象数据, 结构比较深, 但变化时只是外层属性变化 ===> shallowReactive
   - 如果有一个对象数据, 后面会产生新的对象来替换 ===> shallowRef

### 5.2 readonly 与 shallowReadonly

readonly意思就是只读

```typescript
const per = {
    pname: 'aa',
    stu: {
        sname: 'bb'
    }
}
const user = readonly(per)//里面所有内容都是只读的
const user = shallowReadonly(per)//对象中的对象的属性不是只读的
```

### 5.3 toRaw 与 markRaw

- toRaw 
   - 返回由 `reactive` 或 `readonly` 方法转换成响应式代理的普通对象。
   - 这是一个还原方法，可用于临时读取，访问不会被代理/跟踪，写入时也不会触发界面更新。
- markRaw 
   - 标记一个对象，使其永远不会转换为代理。返回对象本身
   - 应用场景: 
      - 有些值不应被设置为响应式的，例如复杂的第三方类实例或 Vue 组件对象。
      - 当渲染具有不可变数据源的大列表时，跳过代理转换可以提高性能

```typescript
const per = {
    pname: 'aa',
    stu: {
        sname: 'bb'
    }
}
const person = reactive(per)
const user = toRaw(person)
user.name = 'cc'//页面不会发生变化

const age = markRaw(12)
per.age = age//per.age以后不会发生响应
```

### 5.4 customRef

customRef是自定义ref对象，可以与防抖相结合

```typescript
function useDebouncedRef<T>(value: T, delay = 200) {
  let timeout: number
  return customRef((track, trigger) => {
    return {
      get() {
        // 告诉Vue追踪数据
        track()
        return value
      },
      set(newValue: T) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          // 告诉Vue去触发界面更新
          trigger()
        }, delay)
      }
    }
  })
```

```typescript
const keyword = useDebouncedRef('', 1000)
```

### 5.5 响应式数据判断

直接调用以下方法，返回值为true或者false

- isRef: 检查一个值是否为一个 ref 对象
- isReactive: 检查一个对象是否是由 `reactive` 创建的响应式代理
- isReadonly: 检查一个对象是否是由 `readonly` 创建的只读代理
- isProxy: 检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理

### 5.6 provide 与 inject

provide与 inject可以实现跨层级组件之间的通行

发送

```typescript
provide('color', color)
```

接收

```typescript
const color = inject('color')
```
