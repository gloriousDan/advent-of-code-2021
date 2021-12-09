import {readFileSync} from "fs";

const filename = "input.txt"

// Type definitions

type Board = {
    containedNumbers: Record<number, BoardPos>
    unmarkedNumbersCount: { columns: number[], rows: number[] }
}

/**
 * Describes Position of a number on the board.
 * (x: 0, y: 0) is located at the top left hand corner.
 */
type BoardPos = {x: number, y: number, marked: boolean}


// Gerneral Functions

const loadLinesFromFile = (filename: string) => {
    const fileBuffer = readFileSync(filename, {encoding: "utf-8"})
    return fileBuffer.split(/\r?\n/)
}

function initializeBoard(boardNumbers: number[][]): Board {
    const emptyCountArray = [5, 5, 5, 5, 5]
    const containedNumbers = boardNumbers.reduce((aggregate: Board["containedNumbers"], newVal, y) => {
        const newValues = newVal.reduce((aggregate: Board["containedNumbers"], number, x): Board["containedNumbers"] => {
            const newNumberEntry: Board["containedNumbers"] = {
                [number]: {x, y, marked: false}
            }
            return {...aggregate, ...newNumberEntry}
        }, {})
        return {...aggregate, ...newValues}
    },{})

    return {
        containedNumbers: containedNumbers,
        unmarkedNumbersCount: {columns: emptyCountArray, rows: emptyCountArray}
    }
}

function decrementValueInArray(index: number, array: number[]) {
    return [...array.slice(0, index), array[index] - 1, ...array.slice(index + 1)]
}

function renderBoard(board: Board) {
    const emptyBoard = [
        ["   ", "   ", "   ", "   ", "   "],
        ["   ", "   ", "   ", "   ", "   "],
        ["   ", "   ", "   ", "   ", "   "],
        ["   ", "   ", "   ", "   ", "   "],
        ["   ", "   ", "   ", "   ", "   "],
    ]
    const renderedBoard = Object.keys(board.containedNumbers).map(key => parseInt(key)).map(key => {return {key: key, value: board.containedNumbers[key]}}).reduce((agg, newVal) => {
        const numberString = newVal.key < 10 ? `0${newVal.key}`: `${newVal.key}`
        const lineToUpdate = agg[newVal.value.y]
        const updatedLine = [...lineToUpdate.slice(0, newVal.value.x), (!newVal.value.marked ? ` ${numberString} `: `(${numberString})`), ...lineToUpdate.slice(newVal.value.x + 1)]
        return [...agg.slice(0, newVal.value.y), updatedLine, ...agg.slice(newVal.value.y + 1)]
    }, emptyBoard)
    console.log(`\n${renderedBoard.map(line => line.join("|")).join("\n")}\n`)
}

// Task 1 code

function parsePuzzleInput(lines: string[]): {drawnNumbers: number[], boards: Board[]} {
    const drawnNumbers = lines[0].split(",").map(char => parseInt(char))
    const { boards: boardStrings } = lines.slice(2).reduce((aggregate: {currentIndex: number, boards: string[][]}, newVal) => {
        if (newVal === "") {
            return {boards: [...aggregate.boards, []], currentIndex: aggregate.currentIndex + 1}
        }
        return {...aggregate, boards: [...aggregate.boards.slice(0, -1), [...aggregate.boards.slice(-1).flat(), newVal]] }
    },{currentIndex: 0, boards: []})
    const boards = boardStrings.map(board => board.map(string => string.split(" ").filter(substring => substring !== "").map(substring => parseInt(substring))))

    return {drawnNumbers: drawnNumbers, boards: boards.map(initializeBoard).filter(board => Object.keys(board.containedNumbers).length === 5 * 5)}
}

function calcUnmarkedSum(board: Board) {
    return Object.keys(board.containedNumbers).map(key => parseInt(key)).reduce((agg, newVal) => {
        return agg + (board.containedNumbers[newVal].marked ? 0 : newVal)
    }, 0)
}

function solveBoard(drawnNumbers: number[], board: Board, boardIndex: number) : {winingNumberIndex: number, finalBoard: Board} {
    const {board: finalBoard, lastIndex: winningNumberIndex} = [...drawnNumbers].reduce(({board, lastIndex }, drawnNumber, index, array) => {
        const boardNumber = board.containedNumbers[drawnNumber]
        if (boardNumber !== undefined && boardNumber.marked === false) {
            const newBoard: Board = {
                unmarkedNumbersCount: {
                    rows: decrementValueInArray(boardNumber.y, board.unmarkedNumbersCount.rows),
                    columns: decrementValueInArray(boardNumber.x, board.unmarkedNumbersCount.columns)
                },
                containedNumbers: {...board.containedNumbers, [drawnNumber]: {...boardNumber, marked: true} }
            }
            if (checkBoardIfBingo(newBoard))
                array.splice(1)
            return {board: newBoard, lastIndex: index}

        }
        else
            return {board: board, lastIndex: index}
    }, {board: board,lastIndex: 0})

    return {winingNumberIndex: winningNumberIndex, finalBoard: finalBoard}
}

function checkBoardIfBingo(board: Board) {
    return [...board.unmarkedNumbersCount.rows, ...board.unmarkedNumbersCount.columns].some(value => value === 0)
}

function indexOfMin(numbers: number[]): number {
    const { numberIndex } = numbers.map((number, index) => { return {number: number, numberIndex: index}})
        .reduce((agg: {number: number, numberIndex: number}, newNumber) =>
            newNumber.number < agg.number ? newNumber : agg)
    return numberIndex
}

const task1 = () => {
    const lines = loadLinesFromFile(filename)
    const puzzleInput = parsePuzzleInput(lines)

    const results = puzzleInput.boards.map((board, index) => solveBoard(puzzleInput.drawnNumbers, board, index))
    const winningBoardIndex = indexOfMin(results.map(result => result.winingNumberIndex))
    const winningBoardUnmarkedSum = calcUnmarkedSum(results[winningBoardIndex].finalBoard)
    console.log("winning Board: ")
    renderBoard(results[winningBoardIndex].finalBoard)
    console.log(`The solution for Task 1 is: ${puzzleInput.drawnNumbers[results[winningBoardIndex].winingNumberIndex] * winningBoardUnmarkedSum}, \
\   winningNumberIndex: ${results[2].winingNumberIndex}, winningBoardUnmarkedSum: ${winningBoardUnmarkedSum}, winningBoardIndex: ${winningBoardIndex}`)
}

task1()

//  Task 2 code

function indexOfMax(numbers: number[]) {
    const { numberIndex } = numbers.map((number, index) => { return {number: number, numberIndex: index}})
        .reduce((agg: {number: number, numberIndex: number}, newNumber) =>
            newNumber.number > agg.number ? newNumber : agg)
    return numberIndex
}

const task2 = () => {
    const lines = loadLinesFromFile(filename)
    const puzzleInput = parsePuzzleInput(lines)
    const results = puzzleInput.boards.map((board, index) => solveBoard(puzzleInput.drawnNumbers, board, index))
    const lastWinningBoardIndex = indexOfMax(results.map(result => result.winingNumberIndex))
    const lastWinningBoardUnmarkedSum = calcUnmarkedSum(results[lastWinningBoardIndex].finalBoard)
    console.log("last winning Board: ")
    renderBoard(results[lastWinningBoardIndex].finalBoard)
    console.log(`The solution for Task 2 is: ${puzzleInput.drawnNumbers[results[lastWinningBoardIndex].winingNumberIndex] * lastWinningBoardUnmarkedSum}, \
\   winningNumberIndex: ${results[2].winingNumberIndex}, winningBoardUnmarkedSum: ${lastWinningBoardUnmarkedSum}, winningBoardIndex: ${lastWinningBoardIndex}`)
}

task2()
