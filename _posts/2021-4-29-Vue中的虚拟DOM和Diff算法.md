---
layout: post
title: Vue3中的虚拟DOM和Diff算法
date: 2021-9-1
categories: blog
tags: [Vue]
author: Mars
pIdentifier: 中文缩进
---

# 一、虚拟DOM是什么？基本实现流程是？

## 1. 什么是虚拟DOM

**虚拟DOM是用JS对象，对真实DOM树进行的简化模拟。**

基本的虚拟DOM元素，叫做VNode，它包含以下几个属性：

- **tag:** 对应的DOM元素标签名；
- **props:** 对应的DOM元素Attributes；
- **children:** 子元素。可以是纯文本子元素，也可以是VNode子元素。

## 2. 基本的虚拟DOM实现流程

虚拟DOM的实现流程：

1. 通过createNode（也常写作**h函数**），生成VNode节点；
2. 各VNode节点通过children属性，相互嵌套形成树结构，构成**虚拟DOM树**（与真实DOM一一映射）；
3. 每当数据有更新，同步更新虚拟DOM树 **（对应操作：render）**；
4. **将新、旧虚拟DOM树进行比较(对应操作：diff)，找出差异之处；**
5. **将这些差异之处，增量更新到真实的DOM树中(对应操作：patch —— 打补丁)；**

虚拟DOM更新一次操作的时间复杂度：

> **O(render V-DOM) + O(diff) + O(patch)**

其中，render和diff是纯JS操作，patch操作复杂度与DOM的更改量**δdom**正相关；

![虚拟DOM](/assets/posts/31.png)

# 二、为什么需要虚拟DOM而不是直接操作DOM？

使用JS模拟DOM（虚拟DOM）的原因：

1. 操作DOM元素的操作比较昂贵，JS操作相对便宜。虚拟DOM的render+diff是纯JS操作，patch操作复杂度与DOM的更改量δdom正相关；因此，虚拟DOM可以在各种情况下都保证相对不错的性能：
   - 在DOM树元素较多而修改的部分较少的情况下：执行虚拟DOM的【render + diff + patch】操作，比直接重新生成渲染整个DOM树消耗更低；
   - 在全部元素都修改了的情况下：直接重新生成替换DOM树的效率更高，render+diff操作将成为额外代价；
2. 使UI界面生成函数化；
3. 虚拟DOM树是一个JS对象，可以作为一种通用格式，不局限于浏览器DOM，也可以在其他平台进行渲染；

# 三、虚拟DOM与diff算法的简易实现

```js

// create a [vnode], with properties:
// 1. tag: HTML NodeTag 
// 2. props: HTML element attributes
//    props contain 2 kinds: 
//      - [eventListener] 'onEvent';
//      - [normal attributes] 'attr';
// 3. children: child vnodes.
//    child nodes contain 2 kinds: 
//      - [text] normal text string node;  <div>123</div>
//      - [other Vnodes] <div><span></span></div>
function h(tag, props, children) {
    return {
        tag,
        props,
        children
    }
}


// mount [vnode] to a [container].
function mount(vnode, container, anchor) {

    // Create an DOM element according to vnode's tag. 
    const el = document.createElement(vnode.tag)

    // When a Vnode is mounted:
    // Set a property to Vnode to memorize the real DOM element where it's mounted.
    vnode.el = el

    // Set attributes. (props)
    if (vnode.props) {
        for (const key in vnode.props) {
            if (key.startsWith('on')) {
                el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key])
            } else {
                el.setAttribute(key, vnode.props[key])
            }
        }
    }

    // Dealing with Vnode's children node.
    if (vnode.children) {
        if (typeof vnode.children === 'string') {
            el.textContent = vnode.children
        } else {
            vnode.children.forEach((child) => {
                mount(child, el)
            })
        }
    }

    // Anchor means:
    // In container element, where the new element to insert before.
    // anchor should be an real DOM element, and it should be the container element's child element.
    if (anchor) {
        container.insertBefore(el, anchor)
    } else {
        // No anchor, insert it at the tail.
        container.appendChild(el)
    }
}

// patch() function:
// Compare n1 node (old) and n2 node (new), find their difference & modify them in the real DOM tree.
function patch(n1, n2) {
    // 1. check if n1 and n2 are of the same type
    if (n1.tag !== n2.tag) {
        // 2. if not same type, replace directly
        const parent = n1.el.parentNode
        const anchor = n1.el.nextSibling
        parent.removeChild(n1.el)
        mount(n2, parent, anchor)
        return
    }

    // Reuse the original DOM element
    const el = (n2.el = n1.el)

    // 3. if yes
    // 3.1 diff props
    const oldProps = n1.props || {}
    const newProps = n2.props || {}
    for (const key in newProps) {
        const newValue = newProps[key]
        const oldValue = oldProps[key]
        if (newValue !== oldValue) {
            if (newValue !== null) {
                el.setAttribute(key, newValue)
            } else {
                el.removeAttribute(key)
            }
        }
    }
    for (const key in oldProps) {
        if (!(key in newProps)) {
            el.removeAttribute(key)
        }
    }
    // 3.2 diff children
    const oc = n1.children // old children
    const nc = n2.children // new children
    if (typeof nc === 'string') { // pure text children.
        if (nc !== oc) {
            el.textContent = nc
        }
    } else if (Array.isArray(nc)) { // vnode array children.
        if (Array.isArray(oc)) {
            // array diff
            const commonLength = Math.min(oc.length, nc.length)
            for (let i = 0; i < commonLength; i++) {
                patch(oc[i], nc[i])
            }
            if (nc.length > oc.length) {
                nc.slice(oc.length).forEach((c) => mount(c, el))
            } else if (oc.length > nc.length) {
                oc.slice(nc.length).forEach((c) => {
                    el.removeChild(c.el)
                })
            }
        } else {
            el.innerHTML = ''
            nc.forEach((c) => mount(c, el))
        }
    }
}

const Component = {
    data() {
        return {
            count: 0
        }
    },
    render() {
        return h(
            'div', {
                onClick: () => {
                    this.count++
                }
            },
            String(this.count)
        )
    }
}

function createApp(Component, container) {
    // implement this
    const state = reactive(Component.data())
    let unMount = true
    let prevTree
    watchEffect(() => {
        const tree = Component.render.call(state)
        if (unMount) {
            console.log(tree);
            mount(tree, container)
            unMount = false
        } else {
            patch(prevTree, tree)
        }
        prevTree = tree
    })
}

// calling this should actually mount the component.
createApp(Component, document.getElementById('app'))
```

# 四、Vue3中真实的diff算法

[Vue3中的diff算法](/blog/2021/09/06/Vue3中的diff算法)