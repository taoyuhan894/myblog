---
title: 数据拷贝
date: 2022-04-19
tags: 
  - JavaScript
  - 深浅拷贝
  - hasOwnProperty
author: Baymax
---
## 数据类型及拷贝方式
JavaScript的数据类型分为基本类型和引用类型：<br />基本类型有：

- number
- string
- boolean
- null
- undefined
- symbol

引用类型有：

- object
- function
- array

基本数据类型在拷贝的时候会产生新的副本，原值是不会改变的。引用数据类型在普通的赋值拷贝时，拷贝的是引用的地址。
```javascript
let arr = [1, 2, 3]
let arr2 = arr
arr2[0] = 0
console.log(arr) // [0, 2, 3]
```
正确的拷贝方法是是新开辟一个空间来存储新的数组
```javascript
let arr = [1, 2, { a: 1 }]
let arr2 = arr.slice()
arr2[0] = 0
arr2[2].a = 3
console.log(arr) // [1, 2, { a: 3 }]
```
虽然数组中的原始值被拷贝了，但是引用值并没有被拷贝，这里的方式采用的就叫浅拷贝，还有另外一种方式为深拷贝。
## 浅拷贝的实现
```javascript
const shallowClone = (target) => {
  // 先判断目标为原始值还是引用值
  // typeof null 的结构为'object',但是null直接赋值就可以
  if (typeof target === 'object' && target !== null) {
    // 从内存中开辟一个新的空间，判断目标是对象还是数组
    const cloneTarget = Array.isArray(target) ? [] : {}
    // 对目标进行遍历
    for (let prop in target) {
      // 通过hasOwnProperty来判断目标身上的属性是否是自己本身的
      if (Object.prototype.hasOwnProperty.call(target, prop)) {
        cloneTarget[prop] = target[prop]
      }
    }
    // return出去触发闭包
    return cloneTarget
  } else {
    return target
  }
}
```
其他常用的方式还有：

- `Object.assign()`
- `...`扩展运算符
- `arr.slice()`
- `[].contact(arr)`
## 深拷贝的实现
深拷贝就是浅拷贝的基础上，需要判断每一项的数据，然后在递归调用自己对引用类型的数据再做一次拷贝。
```javascript
const deepClone = (target) => {
  // 先判断目标为原始值还是引用值
  // typeof null 的结构为'object',但是null直接赋值就可以
  if (typeof target === 'object' && target !== null) {
    // 从内存中开辟一个新的空间，判断目标是对象还是数组
    const cloneTarget = Array.isArray(target) ? [] : {}
    // 对目标进行遍历
    for (let prop in target) {
      // 通过hasOwnProperty来判断目标身上的属性是否是自己本身的
      if (Object.prototype.hasOwnProperty.call(target, prop)) {
        cloneTarget[prop] = deepClone(target[prop])
      }
    }
    // return出去触发闭包
    return cloneTarget
  } else {
    return target
  }
}
```
以下为考虑对象循环引用的拷贝：
```javascript
const deepClone = (obj, cache = []) => {

  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  const hit = cache.find(c => c.original === obj)
  if (hit) return hit.copy

  const copy = Array.isArray(obj) ? [] : {}

  cache.push({
    origin: obj,
    copy
  })

  Object.keys(obj).forEach(key => {
    copy[key] === deepClone(obj[key], cache)
  })

  return copy
}
```
