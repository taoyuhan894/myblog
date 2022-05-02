---
title: Vue2响应式浅析
date: 2022-04-22
tags: 
  - 响应式原理
  - Vue2
author: Baymax 
---
## defineProperty
`Object.defineProperty()`方法直接在一个对象上定义新的属性或修改现有属性，并返回该对象。<br />下面做一个简单的示例：
```javascript
 const data = {}
 let name = '123'

 Object.defineProperty(data, 'name', {
   get: function() {
     return name
   },
   set: function(newValue) {
     console.log('set')
     name = newValue
     // 视图重新渲染
   }
 })

data.name = 234 // set
console.log(data.name) // 234
```
使用`Object.defineProperty()`在data上定义一个name属性，该属性有一个get和set方法，在访问该属性时（data.name）会触发get方法，在给该属性设置值的时候会（data.name = 234）触发set方法。通过这个两个方法就可以对data上的name属性进行监听，当该属性的值变化时，在set中将视图重新渲染。
## 响应式基本实现
以下只是简单的模仿，完整的响应式应该包括数据劫持、收集依赖、发布订阅。
```javascript
    const data = {
      name: 'qwe',
      age: 20,
      info: {
        level: 10
      }
    }

    // 对data数据进行观测
    observer(data)

    // 数据观测函数
    function observer(target) {
      if (typeof target !== 'object' || target === null) {
        return target
      }

      for (let key in target) {
        defineReactive(target, key, target[key])
      }
    }

    // 将target中的每一个属性都设置为响应式
    function defineReactive(target, key, value) {
      // 如歌target为一个对象，就需要将该对象设置为响应式，相当于再调用一次observer
      observer(value)

      Object.defineProperty(target, key, {
        get() {
          return value
        },
        set(newValue) {
          // 在set的时候同样也需要对set的数据进行观测
          observer(newValue)
          if (newValue !== value) {
            value = newValue
            console.log('视图更新')
          }
        }
      })
    }

    // data.age = 21 // 视图更新

    // data.info.level = 1 // 视图更新

    // 视图更新 两个对象存储的地址不一样，所以也进行了更新
    data.info = { level: 10 }

    // 这里不会使得视图更新，Vue提供了Vue.delete API来实现
    delete data.age 

    // 同样直接向对象中添加一个属性也不会触发视图更新，Vue提供了Vue.set API
    data.sex = 'male'
```
上面只是考虑到对象的属性为对象或者原始值的情况，属性还有数组的情况，直接使用数组原生的API来实现push、pop等操作并没有更新视图的操作，所以需要在原本的操作上添加更新视图的操作。
```javascript
    const data = {
      name: 'qwe',
      age: 20,
      info: {
        level: 10
      },
      arr: ['123']
    }

    // 将数组的原型取出来，目的是获得数组的方法
    const oldArrayProto = Array.prototype

    // 这里新创建一个对象，并且它的__proto__指向Array.prototype
    // 这样newArrayProto就拥有数组的全部方法
    const newArrayProto = Object.create(oldArrayProto)

    const arrMethods = ['push', 'pop', 'shift', 'unshift']
    
    arrMethods.forEach(methodName => {
      // 这里就需要重写数组的这几个方法，
      // 让这些方法不仅能执行原本的功能，而且还能够更新视图
      newArrayProto[methodName] = function() {
        oldArrayProto[methodName].call(this, ...arguments)
        console.log('更新视图')
      }
    })

    // 对data数据进行观测
    observer(data)

    // 数据观测函数
    function observer(target) {
      if (typeof target !== 'object' || target === null) {
        return target
      }

      // 修改数组的原型，重写方法
      if (Array.isArray(target)) {
        target.__proto__ = newArrayProto
      }

      for (let key in target) {
        defineReactive(target, key, target[key])
      }
    }

    // 将target中的每一个属性都设置为响应式
    function defineReactive(target, key, value) {
      // 如歌target为一个对象，就需要将该对象设置为响应式，相当于再调用一次observer
      observer(value)

      Object.defineProperty(target, key, {
        get() {
          return value
        },
        set(newValue) {
          // 在set的时候同样也需要对set的数据进行观测
          observer(newValue)
          if (newValue !== value) {
            value = newValue
            console.log('视图更新')
          }
        }
      })
    }

    // data.age = 21 // 视图更新

    // data.info.level = 1 // 视图更新

    // 视图更新 两个对象存储的地址不一样，所以也进行了更新
    // data.info = { level: 10 }

    // 这里不会使得视图更新，Vue提供了Vue.delete API来实现
    // delete data.age 

    // 同样直接向对象中添加一个属性也不会触发视图更新，Vue提供了Vue.set API
    // data.sex = 'male'

    data.arr.push('123445') // 更新视图
```
