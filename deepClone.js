const obj = {
    a: '123',
    b: 123,
    c: null,
    d: undefined,
    e: false,
    f: [1,2,3],
    g: {
        h: 456
    },
    i: new Date(),
    j: new RegExp(),
    k: function (a, b) {
        return a + b
    },
    l: () => {
        return 987
    },
    m: new Error(),
    n: Symbol('n'),
    o: new Map()
}

/**
 * map解决循环引用(需要拷贝当前对象时,先去map查找是否已经存在)
 * WeackMap 是一组键值对的集合,其中键是弱引用,其键必须是对象,值可以是任意的
 * 弱引用:指不能确保其引用的对象不会被垃圾回收器回收的引用.一个对象若只被弱引用所引用,则被认为是不可访问的,并因此可能在任何时刻被回收.
 * 为什么要用weakmap:如果要拷贝的对象非常庞大,使用map会对内存造成非常大的额外消耗,需要手动消除map的属性才能释放这块内存.
 * @param {*} obj 
 * @param {*} map 
 */

function deepClone(obj, map = new WeakMap()) {
    let targetObj
    // Date
    if (isDate(obj)) {
        return new Date(obj.getTime())
    }
    // Reg
    if (isRegExp(obj)) {
        return copyRegExp(obj)
    }
    // null
    if (isNull(obj) && !(isFunction(obj) || isObject(obj))) {
        return obj
    }
    // symbol
    if (isSymbol(obj)) {
        return copySymbol(obj)
    }
    // 一般不处理函数 因为克隆出来的函数无法进入原先的执行环境,运行结果不同
    if (isFunction(obj)) {
        const bodyReg = /(?<={)(.|\n)+(?=})/m
        const paramReg = /(?<=\().+(?=\)\s+{)/
        if (obj.prototype) { // 普通函数
            const param = paramReg.exec(obj.toString())
            const body = bodyReg.exec(obj.toString())
            if (body) {
                if (param) {
                    const paramArr = param[0].split(',')
                    return new Function(...paramArr, body[0])
                } else {
                    return new Function(body[0])
                }
            } else {
                return null
            }
        } else { // 箭头函数
            return eval(obj.toString())
        }
    }
    if (isObject(obj)) {
        targetObj = isArray(obj) ? [] : {}
        if (map.get(obj)) {
            return map.get(obj)
        }
        map.set(obj, targetObj)
        for (const key in obj) {
            targetObj[key] = deepClone(obj[key])
        }
        return targetObj
    }
    if (isMap(obj)) {
        const Ctor = obj.constructor
        targetObj = new Ctor()
        obj.forEach((value, key) => {
            targetObj.set(key, deepClone(value))
        })
        return targetObj
    }
    return obj
}

function getTypes(value) {
    return Object.prototype.toString.call(value)
}

function copyRegExp(regExp) {
    let attrs = '';
    if (regExp.global) attrs += 'g';
    if (regExp.ignoreCase) attrs += 'i';
    if (regExp.multiline) attrs += 'm';
    let newRegExp = new RegExp(regExp, attrs);
    newRegExp.lastIndex = regExp.lastIndex;
    return newRegExp;
}

function copySymbol(targe) {
    return Object(Symbol.prototype.valueOf.call(targe));
}

const isObject = (value) => {return getTypes(value) === '[object Object]'}
const isArray = (value) => {return getTypes(value) === '[object Array]'}
const isNull = (value) => {return getTypes(value) === '[object Null]'}
const isDate = (value) => {return getTypes(value) === '[object Date]'}
const isRegExp = (value) => {return getTypes(value) === '[object RegExp]'}
const isFunction = (value) => {return getTypes(value) === '[object Function]'}
const isSymbol = (value) => {return getTypes(value) === '[object Symbol]'}
const isMap = (value) => {return getTypes(value) === '[object Map]'}


obj.o.set('o', 'o')
let newObj = deepClone(obj)
newObj.b = 456
newObj.g.h = 789
newObj.f[2] = 4
newObj.o.set('o', 'oooo')
console.log(obj)
console.log(newObj)
