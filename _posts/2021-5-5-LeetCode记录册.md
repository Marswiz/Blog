---
layout: post
title: LeetCode记录册
date: 2021-5-4
categories: blog
tags: [LeetCode,Algorithm]
author: Mars
pIdentifier: 中文缩进
---

> 开心地边刷LeetCode边记录呀，也么哥~~
>

# 1. 数组 Array

## 二分查找类型

### 704.二分查找

> [704.二分查找](https://leetcode-cn.com/problems/binary-search/)

```js
// 双指针法
// 1. 设置左右两侧指针，左边起始为0，右边起始位length-1
// 2. 当左右两指针交叉，搜索结束，此时意味着没有找到，返回-1
// 细节： 当左右两指针间隔一个元素，会导致下一次左右指针重合。当左右指针间隔0个元素，下一次也一定会重合，所以最终左右指针一定会有一次重合。
//  左右指针重合时为最后一次查找，如果这个元素仍然不是，说明没有，返回-1.
let search = function(nums, target) {
    let left = 0
    let right = nums.length - 1
    while (left <= right) {
        let mid = Math.floor( (left + right) / 2 )
        if ( nums[mid] > target ){
            right = mid - 1
        } else if ( nums[mid] < target ){
            left = mid + 1
        } else {
            return mid
        }
    }
    return -1 
};
```

### 35. 搜索插入位置

> [35.搜索插入位置](https://leetcode-cn.com/problems/search-insert-position/)

与上面一题相同，只不过在最后不返回-1。

最后left和right交叉，target一定在right,left中间，也就是right+1位置，也就是left位置。

所以最后:

```js
return left;
```

### 34. 在排序数组中查找元素的第一个和最后一个位置

> [34.在排序数组中查找元素的第一个和最后一个位置](https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

```js
// 定义一个函数findMid，作用是传入左右边界，用二分法找到数组中目标值的下标；
// 先整体执行一次，找到目标值的第一个位置，标记为mid。如果没找到，则说明没有，返回[-1,-1]
// 然后从这个mid一分为二，[0,mid-1]/[mid+1, nums.length-1]，分别对两边执行findMid，判断结果是否为-1，如果还不是-1，说明继续找到，则目标结果左边界拓宽到新的mid。右边同理。
// 直到两边都找到边界，返回结果。
var searchRange = function(nums, target) {
    let leftPointer = 0
    let rightPointer = nums.length - 1
    function findMid(left, right){
        while (left <= right){
            let mid = Math.floor( (left + right) / 2 )
            if ( nums[mid] > target ){
                right = mid - 1
            } else if ( nums[mid] < target ){
                left = mid + 1
            } else {
                return mid
            }
        }
        return -1
    }

    let mid = findMid(leftPointer, rightPointer)
    // nums一分为二
    let midLeft = mid
    let midRight = mid

    while ( findMid(leftPointer, midLeft - 1) !== -1 ){
        midLeft = findMid(leftPointer, midLeft - 1)
    }

    while ( findMid(midRight + 1, rightPointer) !== -1 ){
        midRight = findMid(midRight + 1, rightPointer)
    }

    return [midLeft,midRight]
};
```

### 69. x 的平方根

> [69. x 的平方根](https://leetcode-cn.com/problems/sqrtx/)

```js
var mySqrt = function(x) {
    let target = x
    let left = 0
    let right = x
    while (left <= right){
        let mid = Math.floor( ( left + right ) / 2 )
        if ( (mid * mid) > target ){
            right = mid - 1
        } else if ( (mid * mid) < target ){
            left = mid + 1
        } else {
            return mid
        }
    }
    return right
};
```

### 367. 有效的完全平方数

基本同上题。

## 双指针法

### 27. 移除元素

> [27. 移除元素](https://leetcode-cn.com/problems/remove-element/)

```js
// 一开始写的直接遍历删除。。不符合原地修改的要求
var removeElement = function(nums, val) {
    for (let i=0; i<nums.length; i++){
        if ( nums[i] === val ){
            nums.splice(i,1)
            i--
        }
    }
    return nums.length
};
```

### 26. 删除有序数组中的重复项

> [26. 删除有序数组中的重复项](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array/)

```js
// 双指针法
// fast指针用于向前探索，slow指针用于指向当前值元素位置
// 当fast探索到出现不同元素时，slow指针向前移动，并用fast指针数据覆盖记录；
// 即使fast slow指针重叠也本地覆盖。
var removeDuplicates = function(nums) {
    let fast = 0
    let slow = 0
    while (fast < nums.length - 1){
        fast++
        if (nums[fast] !== nums[slow]){
            slow++
            nums[slow] = nums[fast]
        }
    }
    return slow + 1
};
```
