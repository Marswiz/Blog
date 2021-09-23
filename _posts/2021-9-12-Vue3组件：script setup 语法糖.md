---
layout: post
title: Vue3组件：script setup 语法糖
date: 2021-9-12
categories: blog
tags: [Vue]
author: Mars
pIdentifier: 中文缩进
---

> Vue3组件：script setup 语法糖
> 
> [Vue3 RFC: script-setup](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md)

`<script setup>`语法糖引入的动机，是**简化冗余代码，让SFC书写更简洁。**

# 1. 书写形式

```js
<script setup>
  // codes..
</script>
```

# 2. `<script setup>`基本用法
- 内部声明的变量和引入的变量都在`<template>`中立即可用
- 内部的变量，可以直接用作组件标签名（转为kebab-case或保留原形式都可以）；
- 内部的变量如果要作为自定义指令使用，必须命名为小写**`v`开头的驼峰法变量**(vMyDirective => v-my-directive)；
- 使用`defineProps()`和`defineEmits()`定义props和emits，它们在setup中可以直接使用无需引入（定义方法与选项式api相同，传入函数即可）；
- 使用`withDefaults()`为props指定初始值；
- 内部直接可以使用`await`关键字，无需考虑async。当使用了await关键字后，整个标签会被编译成一个async函数；
- 使用`defineExpose()`，选择性地暴露组件的公共接口（在父组件中使用`ref`获取子组件实例可以查看到的接口数据）；
- 导出其他变量，或者需要在组件被导入的时候执行其他函数，需要另外使用一个`<script>`标签声明；
```html
<script>
  performGlobalSideEffect();

  // this can be imported as `import { named } from './*.vue'`
  export const named = 1;
</script>
<script setup>
    // ...setup function declaration.
</script>
```
- `<script setup>`标签不能使用src属性；