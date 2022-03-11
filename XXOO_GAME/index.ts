/* 单元格点击：
    
1 获取到所有单元格列表
2 遍历单元格列表，给每一个单元格添加点击事件
3 给当前被点击的单元格添加类名 X

*/

/* 
切换玩家：
1，创建一个存储当前玩家的变量（currentPlayer),默认值为x
2  将添加给单元格时 写死的类名x,替换为变量currentPlayer)的值
3  切换到另一个玩家：在添加类名（下棋完成一步）后，根据当前玩家，得到另一个玩家
4  处理下一步提示：移除游戏面板中的x和类名，添加下一个玩家对应的类民
*/

/* 
   使用枚举将默认值 x 改为 player.X 
*/

// 单元格列表
let cells = document.querySelectorAll('.cell')
// console.log(cells.length)
// console.log(cells)

// 通过索引获取元素
// console.log(cells[0])
// console.log(cells[4])

// // 使用for循环遍历
// for (let i = 0; i < cells.length; i++) {
//     console.log(cells[i])
// }

// 游戏面板
let gameBord = document.querySelector('#bord')
// console.log(gameBord)

// 获胜信息面板
let message = document.querySelector('#message') as HTMLDivElement

// 获胜者
let winner = document.querySelector('#winner') as HTMLParagraphElement

// 重新开始按钮
let restart = document.querySelector('#restart') as HTMLButtonElement

// 记录下棋的次数
let steps: number

// 枚举 x o
enum Player {
    x = 'x',
    o = 'o'
}
// let currentPlayer:Player = Player.x
let currentPlayer: Player
// console.log(currentPlayer)

startGame() //直接调用函数开始游戏

/*
  重新游戏：

  1 获取到重新开始按钮（#restart），并绑定点击事件。
  2 在点击事件中，重置游戏数据。
  3 隐藏获胜信息、清空棋盘、移除单元格点击事件、重新给单元格绑定点击事件。
  4 重置下棋次数、重置默认玩家为 x、重置下棋提示为 x。


  优化重新游戏功能：

  1 将重新开始按钮的事件处理程序修改为：函数声明形式（startGame）。
  2 直接调用函数（startGame），来开始游戏。
  3 移除变量 steps、currentPlayer 的默认值，并添加明确的类型注解。
  4 移除给单元格绑定事件的代码。
*/
restart.addEventListener('click', startGame)
// 调用该函数来初始化游戏，开始游戏

function startGame() {
    if (!gameBord) return
    // console.log('click')
    // 隐藏获胜信息
    message.style.display = 'none'
    // 重置下棋次数
    steps = 0
    // 重置默认玩家为 x
    currentPlayer = Player.x
    // 重置下棋提示为 x
    gameBord.classList.remove(Player.x, Player.o)
    gameBord.classList.add(Player.x)

    cells.forEach(function (item) {
        let cell = item as HTMLDivElement
        // 清空棋盘
        cell.classList.remove(Player.x, Player.o)
        // 移除单元格点击事件、重新给单元格绑定点击事件
        cell.removeEventListener('click', clickCell)
        cell.addEventListener('click', clickCell, { once: true })
    })
}

// 给单元格绑定点击事件 （和重新游戏代码重复了，优化掉）
// cells.forEach(function (item) {
//     let cell = item as HTMLDivElement
//     // console.log(item)
//     cell.addEventListener('click', clickCell, { once: true })
// })

// 棋盘中单元格的click事件处理程序
function clickCell(event: MouseEvent) {
    if (!gameBord) return

    // console.log('click', event.target)
    let target = event.target as HTMLDivElement
    target.classList.add(currentPlayer)

    steps++

    // 调用判赢函数判断是否获胜
    let isWin = checkWin(currentPlayer)
    if (isWin) {
        message.style.display = 'block'
        winner.innerText = currentPlayer + ' 赢了'
        console.log('当前玩家获胜了', currentPlayer)
        return
    }

    // console.log('获胜之后')

    // 判断平局
    if (steps === 9) {
        message.style.display = 'block'
        winner.innerText = ' 平局～'
        return
    }
    // console.log('平局之后')

    // 关键点:
    // 根据当前玩家，得到另一个玩家
    currentPlayer = currentPlayer === Player.x ? Player.o : Player.x
    // 处理下一步提示
    gameBord.classList.remove(Player.x, Player.o)
    gameBord.classList.add(currentPlayer)
}

/* 
分析判赢数组
*/
let winsArr = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], //横
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], //竖
    [0, 4, 8],
    [2, 4, 6] //斜
]
// 访问数组成员
// console.log(winArr[0])
// console.log(winArr[0][1])

/* 
封装判赢函数
1，声明函数（checkWin),指定参数（player),类型注解为：Player枚举
2，指定返回值：先在函数中写死返回true或false
3，在给单元格添加类名后（下棋后），调用函数checkWin,拿到函数返回值
4，判断函数返回值是否为true，如果是，说明当前玩家获胜了
*/

/* 
优化：
1，去掉判赢函数的中间变量（isWin、cell1、cell2、cell3等等）
2，封装函数（hasclass):判断DOM元素是否包含某个类名
*/
function checkWin(player: Player) {
    /*
    实现判赢函数：

    1 使用 some 方法遍历数组，并使用 some 方法的返回值作为判赢函数的返回结果。
    2 在 some 方法的回调函数中，获取到每种获胜情况对应的 3 个单元格元素。
    3 判断这 3 个单元格元素是否同时包含当前玩家的类名。
    4 如果包含（玩家获胜），就在回调函数中返回 true 停止循环；
      否则，返回 false，继续下一次循环。
    */
    return winsArr.some(function (item) {
        // 获取到每种获胜情况对应的3个单元格元素
        // 2.1先拿到每种获胜情况的三个索引
        // console.log(item)
        let cellIndex1 = item[0]
        let cellIndex2 = item[1]
        let cellIndex3 = item[2]
        // console.log(item[0])
        // console.log(cellIndex1, cellIndex2, cellIndex3)

        // 2.2通过这三个索引从cells中获取到对应的单元格元素(被优化调，直接放在下面)
        // let cell1 = cells[cellIndex1]
        // let cell2 = cells[cellIndex2]
        // let cell3 = cells[cellIndex3]
        // console.log(cell1,cell2,cell3)

        // 3 判断这 3 个单元格元素是否同时包含当前玩家的类名
        // 重点：
        //  1 元素是否包含类名 classList.contains()
        //  2 同时包含（第一个包含 并且 第二个包含 并且 第三个也包含）
        //    逻辑运算符 && 逻辑与
        if (
            // cells[cellIndex1].classList.contains(player) &&
            // cells[cellIndex2].classList.contains(player) &&
            // cells[cellIndex3].classList.contains(player)
            hasClass(cells[cellIndex1], player) &&
            hasClass(cells[cellIndex2], player) &&
            hasClass(cells[cellIndex3], player)
        ) {
            return true
        }
        return false
    })
}
// 封装 hasClass 函数：判断 DOM 元素是否包含某个类名
function hasClass(el: Element, name: string) {
    return el.classList.contains(name)
}

let gouges = 'gou'

var a = 9;

console.log(gouges);