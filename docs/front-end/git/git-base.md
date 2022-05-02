---
title: Git基本操作
date: 2022-04-15
tags: 
  - git
author: Baymax 
---
## 全局配置git

```git
git config --global user.name ""
```

```git
git config --global user.email ""
```

## 初始化

```git
git init
```

## 工作区到暂存区

提交所有的文件

```git
git add *
```

```git
git commit - m ""
```

## 查看当前工作区的状态

```git
git status
```

## 从暂存区恢复文件到工作区

```git
git checkout 文件名
```

## 查看工作区修改的代码

```git
git diff
```

## 查看已经提交到暂存区的历史版本

```git
git log
```

## 恢复文件到指定版本

```bash
git reset --hard 版本号
```

## 生成ssh密匙

```bash
ssh-keygen -t rsa -C "邮箱"
```

id_rsa.pub文件

## 将暂存区的上传到github仓库

```bash
git remote add origin 仓库地址
git push -u origin master
```

## 修改代码后再次提交

```bash
git add *
git commit -m ""
git push
```

## 从远程仓库克隆到本地

```bash
git clone 远程仓库地址
```

## 另一个人更新代码

```bash
git pull
```

## 创建子分支

```bash
git checkout -b 分支名
```

## 查看分支

```bash
git branch
```

## 合并分支

```bash
git merge login
```
