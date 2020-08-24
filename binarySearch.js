// 普通二分查找 O(logn)
function binarySearch(list, target) {
    console.time('fn1')
    let left = 0
    let right = list.length - 1
    let result
    /*
        为什么是<=
        因为初始化 right 的赋值是 nums.length - 1，即最后一个元素的索引，而不是 nums.length
        为什么是 +1 -1 
        middle已经搜索过了 所有middle+1 -1把middle在区间去除
    */
    while(left <= right && !result) {
        let middle = (left + right) >> 1
        if (list[middle] === target) {
            result = middle
        } else if (target < list[middle]) {
            right = middle - 1
        } else if (list[middle] < target) {
            left = middle + 1
        }
    }
    console.timeEnd('fn1')
    console.log(result)
}


// 二分查找左边界 O(logn)
function leftBinarySearch(list, target) {
    console.time('fn1')
    let left = 0
    let right = list.length - 1
    let result
    while(left <= right) {
        let middle = (left + right) >> 1
        if (list[middle] === target) {
            result = middle
            right = middle - 1 // 继续向左区间查找
        } else if (target < list[middle]) {
            right = middle - 1
        } else if (list[middle] < target) {
            left = middle + 1
        }
    }

    if  (left >= list.length || list[left] !== target) {
        result = undefined
    }
    console.timeEnd('fn1')
    console.log(result)
}

function rightBinarySearch(list, target) {
    console.time('fn1')
    let left = 0, right = list.length - 1, result

    while(left <= right) {
        let middle = (left + right) >> 1
        if (list[middle] === target) {
            result = middle
            left = middle + 1 // 继续向右区间查找
        } else if (target < list[middle]) {
            right = middle - 1
        } else if (list[middle] < target) {
            left = middle + 1
        }
    }

    if (right < 0 || list[right] !== target) {
        result = undefined
    }
    console.timeEnd('fn1')
    console.log(result)
}


// const arr = [1,3,5,8,13,26,37,45,66,103,154,256,548,697,851,999]
const arr = [1, 2, 3, 3, 8]

// binarySearch(arr, 66)
rightBinarySearch(arr, 3)