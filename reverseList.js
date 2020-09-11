class Reverse {
    constructor(node, next) {
        this.node = node
        this.next = next
    }

    createList(nodeList) {
        while(list.length > 0) {
            let current = list.shift()
            let node = current[0]
            let next = current[1]
            nodeList.next = new Reverse(node, next)
            this.createList(nodeList.next)
        }
    }

    checkList(nodeList) {
        console.log(nodeList.node)
        if (nodeList.node) {
            this.checkList(nodeList.next)
        }
    }

    // 1->2->3
    reverseKeyList(headNode, K) {
        let index = 1
        let temp
        let newNode = headNode.next // 1
        let oldNode = newNode.next // 2
        while(index < K) {
            temp = oldNode.next // 3
            oldNode.next = newNode // 一开始是1->2  把2->1
            newNode = oldNode // 2->1
            oldNode = temp // 3
            index++
        } // 依次3->2->1 temp = 4 
        headNode.next.next = oldNode
        return newNode
    }
}


let list = [
    ['00101', '12309'],
    ['12309', '33218'],
    ['33218', '00000'],
    ['00000', '99999'],
    ['99999', '68237'],
    ['68237', '-1']
]
// console.log(list.shift())

let linkedList = new Reverse('head')
let newList = new Reverse()

newList.createList(linkedList)
// newList.checkList(linkedList)
let abc = newList.reverseKeyList(linkedList, 3)
newList.checkList(abc)
// console.log(abc)