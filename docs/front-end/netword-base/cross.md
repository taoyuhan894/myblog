---
title: cross跨域
date: 2022-04-17
tags: 
  - cross
  - 跨域
author: Baymax
---
## express配置
```javascript
app.all('*', function(req, res, next) {
  // 请求host来源
  res.header('Access-Control-Allow-Origin', '*')
  // 允许携带用户凭证
  res.header('Access-Control-Allow-Credentials', 'true')
  // 允许的已有配置
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
  // 允许的请求方法
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, ORTIONS')
  // 允许额外设置的headers
  res.header('Access-Control-Allow-Headers', 'id, pk')
  // 设置缓存option配置为1小时
  res.header('Access-Control-Allow-Headers', '3600')
  // options请求返回
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
}
```
## koa配置
```javascript
app.use(async (ctx, next) => {
  const { res, req } = ctx
  // 请求host来源
  res.header('Access-Control-Allow-Origin', '*')
  // 允许携带用户凭证
  res.header('Access-Control-Allow-Credentials', 'true')
  // 允许的已有配置
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
  // 允许的请求方法
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, ORTIONS')
  // 允许额外设置的headers
  res.header('Access-Control-Allow-Headers', 'id, pk')
  // 设置缓存option配置为1小时
  res.header('Access-Control-Allow-Headers', '3600')
  // options请求返回
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    await next()
  }
})
```
## 字段说明

- Access-Control-Allow-Origin：指定域名
- Access-Control-Allow-Credentials：true（是否携带cookie凭证，默认不设置此字段）
- Access-Control-Allow-Headers：header-name（允许修改的http规范内header）
- Access-Control-Allow-Method：http方法
- Access-Control-Expose-Headers：header-name（允许设置的非http规格header）
- Access-Control-Max-Age：number（设置被缓存的时间，建议设置较大数值）
