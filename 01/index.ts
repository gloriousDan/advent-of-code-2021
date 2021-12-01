import {readFileSync} from "fs";

const filename = "input.txt"

const loadNumbersFromFile =  () => {
    const fileBuffer = readFileSync(filename, {encoding: "utf-8"})
    const lines = fileBuffer.split(/\r?\n/)
    return lines.map(line => parseInt(line)).filter(n => !isNaN(n))
}

//  Task 1 Code
const countIncreasingNumbers = (numbers: number[]) => {
    const {higher_count: higherCount} = numbers.reduce((previous, current) => {
        return { higher_count: previous.higher_count + (previous.last_value < current ? 1 : 0), last_value: current}
    }, {higher_count: -1, last_value: 0})
    return higherCount
}

const task1 = () => {
    const numbers = loadNumbersFromFile()
    console.log(`The solution for task 1 is: ${countIncreasingNumbers(numbers)}`)

}
task1()

//  Task 2 code
const calcSlidingWindows = (numbers: number[]) => {
    return numbers.slice(0, numbers.length - 2).reduce((previous: number[], current, currentIndex) => {
        const window = numbers.slice(currentIndex, currentIndex + 3).reduce((sum, currentValue) => sum + currentValue)
        return [...previous, window]
    },[])
}
const task2 = () => {
    const numbers = loadNumbersFromFile()
    const windows = calcSlidingWindows(numbers)
    console.log(`The solution for task 2 is: ${countIncreasingNumbers(windows)}`)
}

task2()