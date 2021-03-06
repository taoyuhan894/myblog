---
title: 前端安全
date: 2022-04-18
tags: 
  - XSS
  - CSRF
author: Baymax
---
## XSS
Cross-Site Scripting（跨站脚本攻击）简称XSS，是一种代码注入攻击。为了和CSS区别开，所以取名为XSS。攻击者可以在目标网站上注入恶意代码，当页面加载或者点开某一条连接时，这些脚本代码可以窃取到cookie、sessions、token等一些敏感的信息，从而窃取用户的信息。<br />XSS引发的本质为：恶意的代码未经过滤，就与网站正常的代码融合在一起，由于浏览器自身是无法识别哪些是恶意代码，哪些是正常代码，从而引发XSS攻击。
### 1. 存储型XSS攻击
存储型XSS攻击意思为恶意攻击的代码存储在服务端数据库中，前端在从服务端获取数据后，恶意代码被当作脚本执行或者直接将恶意代码的内容渲染在页面中。<br />存储型XSS攻击的步骤：

1. 攻击者将恶意代码提交到目标网站数据库中。
1. 用户打开目标网站时，服务端将恶意代码拼接在HTML中返回给浏览器。
1. 浏览器接受到响应后解析，将恶意代码与正常代码全部执行。
1. 恶意代码窃取用户数据发送到攻击者网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作
### 2. 反射性XSS攻击
反射型XSS攻击是指攻击者对网站原本URL进行重新构造，加入恶意代码，服务端从URL中获取参数时将恶意代码抽取出来拼接在HTML中，然后会返回浏览器。<br />反射型XSS攻击的步骤：

1. 攻击者构造出特殊的 URL，其中包含恶意代码。
1. 用户打开带有恶意代码的 URL 时，网站服务端将恶意代码从 URL 中取出，拼接在 HTML 中返回给浏览器。
1. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
1. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。
### 3. DOM型XSS攻击
DOM型XSS攻击一般为前端的JavaScript代码不够严谨，将恶意的内容插入到页面当中，特别需要注意在使用的`innerHTML`、`outerHTML`、`appendChild`、`document.write()`等API时，要注意不要将不可信的数据作为HTML插入到页面上，尽量使用`innerText`、`textContent`、`setAttribute()`等<br />DOM型XSS的攻击步骤：

1. 攻击者构造出特殊的 URL，其中包含恶意代码。
1. 用户打开带有恶意代码的 URL。
1. 用户浏览器接收到响应后解析执行，前端 JavaScript 取出 URL 中的恶意代码并执行。
1. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。
## XSS防范措施
最基本的防范措施就是前后端都对自己接受到的数据进行转义，然后再渲染或者存储到数据库中。<br />其它的防范手段：
### 1. Content Security Policy
在服务端使用HTTP的Content-Security-Policy头部来指定策略，或者在前端使用meta标签。<br />如下面的配置只允许加载同域下的资源：<br />`Content-Security-Policy: default-src 'self'`<br />`<meta http-equiv="Content-Security-Policy" content="form-action 'self';"`
### 2. 输入内容长度的限制
对于不受信任的输入，都设置一个合理的长度，虽然无法完全避免，但能增加XSS攻击的难度。
### 3. 输入内容做限制
对于部分的输入，可以对其限定不能特殊字符或者仅能输入数字等。
### 3. 其他安全措施

- HTTP-only Cookie: HttpOnly
- 提交之前使用验证码
## CSRF
CSRF（Cross-site request forgery）跨站请求伪造，攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。<br />CSRF的特点：

- 攻击一般发起在第三方网站，而不是被攻击的网站。被攻击的网站无法防止攻击发生。
- 攻击利用受害者在被攻击网站的登录凭证，冒充受害者提交操作；而不是直接窃取数据。
- 整个过程攻击者并不能获取到受害者的登录凭证，仅仅是“冒用”。
- 跨站请求可以用各种方式：图片URL、超链接、CORS、Form提交等等。部分请求方式可以直接嵌入在第三方论坛、文章中，难以进行追踪。
## CSRF预防措施
### 1.添加验证码
在转账、交易等操作时增加验证码可以有效的保护用户信息的安全。
### 2. 同源检测
HTTP协议中，每一个异步请求都会携带两个Header，用于标记来源域名：

- Origin Header
- Referer Header

因此服务端可以解析这两个Header中的域名，确定请求的来源域。同源策略在一定程度上可以增加浏览器端的CSRF的攻击难度，但是仅限于少量场景。
### 3. Token校验
服务器随机给用户生成一个token，加密后传递给用户，用户在提交请求时携带这个token，服务端通过验证该token是否正确来判断正常的请求和攻击的请求。
### 4. Set-Cookie Samesite 属性
Set-Cookie相应头新增Samesite属性，它用来表明这个Cookie是个“同站Cookie”，同站Cookie只能作为第一方Cookie，不能作为第三方Cookie，Samesite可以设置为三个值：Strict、Lax和None。

- Strict模式下，浏览器完全禁止第三方请求携带Cookie。比如请求baidu.com网站只能在baidu.com域名当中请求才能携带Cookie，在其它网站请求都不能。
- 在Lax模式下，与Strict相比，放宽了限制，但是只能在GET方法提交表单况或者a标签发送GET请求的情况下可以携带Cookie，其他情况均不能。
- 在None模式下，Cookie将在所有上下文中发送，即允许跨域发送。

原文：[https://zhuanlan.zhihu.com/p/45568315](https://zhuanlan.zhihu.com/p/45568315)
