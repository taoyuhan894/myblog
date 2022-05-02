---
title: React浅析
date: 2022-04-16
tags: 
  - react
author: Baymax
---
## 1. 第一个React页面

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="test"></div>

  <!-- 引入核心库 -->
  <script type="text/javascript" src="../js/react.development.js"></script>

  <!-- 引入react-dom,用于支持react操作dom -->
  <script type="text/javascript" src="../js/react-dom.development.js"></script>

  <!-- 将jsx转为js -->
  <script type="text/javascript" src="../js/babel.min.js"></script>

  <script type="text/babel">
    const VDOM = <h1>Hello</h1>
    ReactDOM.render(VDOM, document.getElementById('test'))
  </script>
</body>
</html>
```

## 2. JSX语法规则

- 定义虚拟dom时不要写引号
- 标签中混入js表达式时要用{}
- 样式类名指定要用className
- 内联样式写法如下
- 只有一个根标签
- 标签必须闭合
- 标签首字母 
   - 首字母小写则转为html同名标签
   - 大写就去渲染对应组件，如无则报错

```jsx
<script type="text/babel">
    const data = 'aaa'
    const VDOM = (
    <div>
        <h1 className="title">
            <span style={{color: 'red', fonsSize: '20px'}}>{data}</span>
        </h1>
    </div>
    )
    ReactDOM.render(VDOM, document.getElementById('test'))
</script>
```

## 3. 组件类别

### 3.1 函数式组件

```jsx
function MyComponent () {
    return <h2>我是一个组件</h2>
}
ReactDOM.render(<MyComponent />, document.getElementById('test'))
```

### 3.2 类式组件

```jsx
class MyComponent extends React.Component {
    render () {
        return <h2>我是一个组件</h2>
    }
}
ReactDOM.render(<MyComponent />, document.getElementById('test'))
```

-  render是MyComponent的原型对象上，供实例使用 
-  render中的this指向MyComponent组件实例对象 
-  React解析组件标签，找到MyComponent组件，当发现改组件是类定义的时，new出来改类的实例，并通过改实例调用到原型上的render方法，将render返回的虚拟DOM转为真是DOM，随后呈现在页面中 

## 4. 状态State

### 4.1 详细版

```jsx
//1.创建组件
class Weather extends React.Component{

    //构造器调用几次？ ———— 1次
    constructor(props){
        console.log('constructor');
        super(props)
        //初始化状态
        this.state = {isHot:false,wind:'微风'}
        //解决changeWeather中this指向问题
        this.changeWeather = this.changeWeather.bind(this)
    }

    //render调用几次？ ———— 1+n次 1是初始化的那次 n是状态更新的次数
    render(){
        console.log('render');
        //读取状态
        const {isHot,wind} = this.state
        return <h1 onClick={this.changeWeather}>今天天气很{isHot ? '炎热' : '凉爽'}，{wind}</h1>
    }

    //changeWeather调用几次？ ———— 点几次调几次
    changeWeather(){
        //changeWeather放在哪里？ ———— Weather的原型对象上，供实例使用
        //由于changeWeather是作为onClick的回调，所以不是通过实例调用的，是直接调用
        //类中的方法默认开启了局部的严格模式，所以changeWeather中的this为undefined

        console.log('changeWeather');
        //获取原来的isHot值
        const isHot = this.state.isHot
        //严重注意：状态必须通过setState进行更新,且更新是一种合并，不是替换。
        this.setState({isHot:!isHot})
        console.log(this);

        //严重注意：状态(state)不可直接更改，下面这行就是直接更改！！！
        //this.state.isHot = !isHot //这是错误的写法
    }
}
//2.渲染组件到页面
ReactDOM.render(<Weather/>,document.getElementById('test'))
```

### 4.2 简写版

```jsx
class MyComponent extends React.Component {
  state = {
    isHot: true
  }
  changeWeather = () => {
    console.log(this)
    const isHot = this.state.isHot
    this.setState({isHot: !isHot})
  }
  render () {
    return <h2 onClick={this.changeWeather}>今天天气很{this.state.isHot ? '炎热' : '凉爽'}</h2>
  }
}
ReactDOM.render(<MyComponent />, document.getElementById('test'))
```

## 5. props

### 5.1 基本使用

```jsx
class MyComponent extends React.Component {
    render () {
        return (
            <ul>
                <li>姓名：{this.props.name}</li>
                <li>性别：{this.props.sex}</li>
                <li>年龄：{this.props.age}</li>
            </ul>
        )
    }
}
const obj = {name:"tyh", age:"12", sex:"male"}
ReactDOM.render(<MyComponent {...obj} />, document.getElementById('test'))
```

### 5.2 传递限制

```jsx
class MyComponent extends React.Component {
    render () {
        return (
            <ul>
                <li>姓名：{this.props.name}</li>
                <li>性别：{this.props.sex}</li>
                <li>年龄：{this.props.age}</li>
            </ul>
        )
    }
}
// 属性类型限制
MyComponent.propTypes = {
    name: PropTypes.string.isRequired
}
// 指定默认属性值
MyComponent.defaultProps = {
    name: 'aaa',
    sex: 'female',
    age: 12
}
const obj = {name:'111', sex:"male"}
ReactDOM.render(<MyComponent {...obj} />, document.getElementById('test'))
```

### 5.3 简写方式

```jsx
class MyComponent extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired
    }
    static defaultProps = {
        name: 'aaa',
        sex: 'female',
        age: 12
    }
    render () {
        return (
            <ul>
                <li>姓名：{this.props.name}</li>
                <li>性别：{this.props.sex}</li>
                <li>年龄：{this.props.age}</li>
            </ul>
        )
    }
}
const obj = {sex:"male"}
ReactDOM.render(<MyComponent {...obj} />, document.getElementById('test'))
```

## 6. ref使用方式

尽可避免字符串形式的ref

```jsx
class MyComponent extends React.Component {
    showInfo = () => {
        const {input1} = this
        alert(input1.value)
    }
    render () {
        return (
            <div>
                <input type="text" ref={c => this.input1 = c} />
                <button onClick={this.showInfo}>点击获取</button>
            </div>
        )
    }
}
ReactDOM.render(<MyComponent />, document.getElementById('test'))
```

## 7. 非受控组件

现用现取的称为非受控组件

```jsx
class MyComponent extends React.Component {
    submitInfo = (e) => {
        e.preventDefault()
        const {username, password} = this
        alert(`用户名为:${username.value},密码为：${password.value}`)
    }
    render () {
        return (
            <form onSubmit={this.submitInfo}>
                <input type="text" ref={c => this.username = c} />
                <input type="password" ref={c => this.password = c} />
                <button type="submit">登录</button>
            </form>
        )
    }
}
ReactDOM.render(<MyComponent />, document.getElementById('test'))
```

## 8. 受控组件

页面中所有输入的dom，随着用户的输入，可以将所输入的内容存在状态中，等需要使用的时候再调用，称为受控组件

```jsx
class MyComponent extends React.Component {
    state = {
        username: '',
        password: ''
    }
    submitInfo = (e) => {
        e.preventDefault()
        const {username, password} = this.state
        alert(`用户名为:${username},密码为：${password}`)
    }
    saveUsername = (e) => {
        this.setState({
            username: e.target.value
        })
    }
    savePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    render () {
        return (
            <form onSubmit={this.submitInfo}>
                <input type="text" onChange={this.saveUsername} />
                <input type="password" onChange={this.savePassword} />
                <button type="submit">登录</button>
            </form>
        )
    }
}
ReactDOM.render(<MyComponent />, document.getElementById('test'))
```

## 9. 高阶函数的使用

### 9.1 高阶函数

- 函数接收的参数是一个函数
- 函数的返回值依然是一个函数

```jsx
class MyComponent extends React.Component {
    state = {
        username: '',
        password: ''
    }
    submitInfo = (e) => {
        e.preventDefault()
        const {username, password} = this.state
        alert(`用户名为:${username},密码为：${password}`)
    }
    saveInfo = (dataType) => {
        return (e) => {
            this.setState({
                [dataType]: e.target.value
            })
        }
    }
    render () {
        return (
            <form onSubmit={this.submitInfo}>
                <input type="text" onChange={this.saveInfo('username')} />
                <input type="password" onChange={this.saveInfo('password')} />
                <button type="submit">登录</button>
            </form>
        )
    }
}
ReactDOM.render(<MyComponent />, document.getElementById('test'))
```

### 9.2 函数的柯里化

通过函数调用继续返回函数的方式，实现多次接收参数最后统一处理的函数编码形式

## 10. 生命周期

生命周期引入

```jsx
class MyComponent extends React.Component {
    state = {
        opacity: 1
    }
    death = () => {
        // 卸载组件
        ReactDOM.unmountComponentAtNode(document.getElementById('test'))
    }
    // 组件挂载完毕
    componentDidMount () {
        this.timer = setInterval (() => {
            let {opacity} = this.state
            opacity -= 0.1
            if (opacity <= 0) opacity = 1
            this.setState({opacity})
        }, 200)
    }
    // 当组件即将被卸载时
    componentWillUnmount () {
        clearInterval(this.timer)
    }
    render () {
        return (
            <div>
                <h1 style={{opacity: this.state.opacity}}>我是一段文字</h1>
                <button onClick={this.death}>卸载改组件</button>
            </div>
        )
    }
}

ReactDOM.render(<MyComponent />, document.getElementById('test'))
```

### 10.1 旧的生命周期图

![](https://pic.imgdb.cn/item/6156f5ee2ab3f51d918efaba.jpg#crop=0&crop=0&crop=1&crop=1&id=KTOP8&originHeight=425&originWidth=538&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

总共分为三个阶段

- **初始化阶段**（由ReactDOM.render()触发---初次渲染） 
   - 1.constructor()
   - 2.componentWillMount()
   - 3.render()
   - 4.componentDidMount()   ===>  一般在改钩子中做一些初始化的事
- **更新阶段**（由组件内部this.setState()或父组件重新render触发） 
   - 1.shouldComponentUpdate()
   - 2.componentWillUpdate()
   - 3.render()
   - 4.componentDidUpdate()
- **卸载组件**（由ReactDOM.unmountComponentAtNode()触发） 
   - componentWillUnmount()  ===>  取消订阅消息等

### 10.2 新的生命周期

![](https://pic.imgdb.cn/item/61571a822ab3f51d91c97a9a.jpg#crop=0&crop=0&crop=1&crop=1&id=Gsm3R&originHeight=395&originWidth=572&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

生命周期的三个阶段（新）

-  **1.** **初始化阶段:** 由ReactDOM.render()触发---初次渲染 
   - constructor()
   - getDerivedStateFromProps
   - render()
   - componentDidMount()
-  **2.** **更新阶段:** 由组件内部this.setSate()或父组件重新render触发 
   - getDerivedStateFromProps
   - shouldComponentUpdate()
   - render()
   - getSnapshotBeforeUpdate
   - componentDidUpdate()
-  **3.** **卸载组件:** 由ReactDOM.unmountComponentAtNode()触发 

### 10.3 getSnapshotBeforeUpdate的使用场景

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>4_getSnapShotBeforeUpdate的使用场景</title>
	<style>
		.list{
			width: 200px;
			height: 150px;
			background-color: skyblue;
			overflow: auto;
		}
		.news{
			height: 30px;
		}
	</style>
</head>
<body>
	<!-- 准备好一个“容器” -->
	<div id="test"></div>
	
	<!-- 引入react核心库 -->
	<script type="text/javascript" src="../js/17.0.1/react.development.js"></script>
	<!-- 引入react-dom，用于支持react操作DOM -->
	<script type="text/javascript" src="../js/17.0.1/react-dom.development.js"></script>
	<!-- 引入babel，用于将jsx转为js -->
	<script type="text/javascript" src="../js/17.0.1/babel.min.js"></script>

	<script type="text/babel">
		class NewsList extends React.Component{

			state = {newsArr:[]}

			componentDidMount(){
				setInterval(() => {
					//获取原状态
					const {newsArr} = this.state
					//模拟一条新闻
					const news = '新闻'+ (newsArr.length+1)
					//更新状态
					this.setState({newsArr:[news,...newsArr]})
				}, 1000);
			}

			getSnapshotBeforeUpdate(){
				return this.refs.list.scrollHeight
			}

			componentDidUpdate(preProps,preState,height){
				this.refs.list.scrollTop += this.refs.list.scrollHeight - height
			}

			render(){
				return(
					<div className="list" ref="list">
						{
							this.state.newsArr.map((n,index)=>{
								return <div key={index} className="news">{n}</div>
							})
						}
					</div>
				)
			}
		}
		ReactDOM.render(<NewsList/>,document.getElementById('test'))
	</script>
</body>
</html>
```

## 11. Diff算法

**(1)react/vue中key有什么作用，key的原理是什么**

a.key时DOM对象的标识，在更新显示时key起着极其重要的作用

b.当状态中的数据发生变化的时候，react会根据新的数据生成新的虚拟DOM，然后新的虚拟DOM与旧的虚拟DOM进行比较，它们先根据key绑定的值进行比较，若新旧虚拟DOM中有两个key值相同的则比较DOm中的内容，若内容相同则直接使用旧的虚拟DOM，真是DOM不发生变化，若内容不同则使用新的虚拟DOM，新的虚拟DOM再生成新的真实DOM替换旧的真是DOM，若原本新旧两个虚拟DOM的内容完全一样，但key值不同，则新的虚拟DOM直接替换旧的虚拟DOM，会产生效率问题。

**(2)用index作为key引发的问题**

如果对数据进行逆序增加或者插入的时候，会产生没有必要的DOM更新，效率很低。

如果结构中还有用户可输入内容的DOM会发生内容的错乱

## 12. 配置代理解决跨域

```javascript
const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    proxy('/api1', {  //api1是需要转发的请求(所有带有/api1前缀的请求都会转发给5000)
      target: 'http://localhost:5000', //配置转发目标地址(能返回数据的服务器地址)
      changeOrigin: true, //控制服务器接收到的请求头中host字段的值
      /*
      	changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
      	changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:3000
      	changeOrigin默认值为false，但我们一般将changeOrigin值设为true
      */
      pathRewrite: {'^/api1': ''} //去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
    }),
    proxy('/api2', { 
      target: 'http://localhost:5001',
      changeOrigin: true,
      pathRewrite: {'^/api2': ''}
    })
  )
}
```

## 13. 组件之间的通信

### 13.1 父子组件之间的通信

子给父--> 自定义函数，通过函数传参

父给子--> props

### 13.2 兄弟之间的通信

消息订阅与发布或者取兄弟之间最近的公共父组件

```bash
yarn add pubsub-js --save
```

发布消息

```javascript
PubSub.publish('myMsg', e)
```

接收消息

```javascript
PubSub.subscribe('myMsg', (msg, data) => {
    console.log(msg, data)
})
```

## 14. 路由的基本使用

```jsx
import React, { Component } from 'react';
import {Route, Link} from 'react-router-dom'
import About from './components/About'
import Home from './components/Home'

export default class App extends Component {
  render() {
    return (
      <div>
        <Link to="/about">About</Link>
        <Link to="/home">Home</Link>
        <Route path="/about" component={About}></Route>
        <Route path="/home" component={Home}></Route>
      </div>
    );
  }
}
```

在index.js中包裹一个路由器

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
```

## 15. 向路由组件传递参数

### 15.1 params参数

-  路由链接(携带参数)： 
```jsx
<Link to='/demo/test/tom/18'}>详情</Link>
```
 

-  注册路由(声明接收)： 
```jsx
<Route path="/demo/test/:name/:age" component={Test}/>
```
 

-  接收参数： 

```jsx
this.props.match.params
```

### 15.2 search参数

-  路由链接(携带参数)： 
```jsx
<Link to='/demo/test?name=tom&age=18'}>详情</Link>
```
 

-  注册路由(声明接收)： 
```jsx
<Route path="/demo/test" component={Test}/>
```
 

-  接收参数： 

```jsx
this.props.location.search
// 备注：获取到的search是urlencoded编码字符串，需要借助querystring解析
```

### 15.3 state参数

-  路由链接(携带参数)： 
```jsx
<Link to={{pathname:'/demo/test',state:{name:'tom',age:18}}}>详情</Link>
```
 

-  注册路由(声明接收)： 
```jsx
<Route path="/demo/test" component={Test}/>
```
 

-  接收参数： 

```jsx
this.props.location.state
// 备注：刷新也可以保留住参数
```

## 16. 编程式路由导航

借助this.prosp.history对象上的API对操作路由跳转、前进、后退

- this.props.history.push()
- this.props.history.replace()
- this.props.history.goBack()
- this.props.history.goForward()
- this.props.history.go()

## 17. 按需引入样式

### 1. 安装依赖：

```bash
yarn add react-app-rewired customize-cra babel-plugin-import less less-loader
```

### 2. 修改package.json

```json
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
}
```

### 3. 根目录下创建config-overrides.js

```javascript
//配置具体的修改规则
const { override, fixBabelImports,addLessLoader} = require('customize-cra');
    module.exports = override(
        fixBabelImports('import', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: true,
        }),
        addLessLoader({
            lessOptions:{
            javascriptEnabled: true,
            modifyVars: { '@primary-color': 'green' },
        }
    }),
);
```
