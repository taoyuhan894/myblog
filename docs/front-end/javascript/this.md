---
title: this指向
date: 2022-04-20
tags: 
  - JavaScript
  - this
author: Baymax
---
以下为一个面试题：
```javascript
var obj = {
  foo: function() {
    console.log(this)
  }
}
var bar = obj.foo
obj.foo() // obj
bar() // window
```
JavaScript中全局存在一个window对象，所有定义的函数或者变量都会挂载到window对象中，比如:
```javascript
var obj = 1
//相当于window对象身上多了一个obj属性
window: {
  obj: 1
}
```
所以`bar()`也可以写成`window.bar()`，而这种写法只是函数调用的一种语法糖形式，完整的写法为`window.bar.call(window)`，call的第一个参数传入的是谁那么函数内部的this就指向谁。`obj.foo()`也就相当于`window.obj.foo(obj)`**（谁调用的该函数，函数内部的this就指向谁）**。<br />_注意：箭头函数内部的this与其外部的函数的this相同，如果外部没有函数包裹，那么this默认指向window_
