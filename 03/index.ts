import {readFileSync} from "fs";

const filename = "input.txt"

type Command = {direction: "forward" | "down" | "up", amount: number}

const loadLinesFromFile = (filename: string) => {
    const fileBuffer = readFileSync(filename, {encoding: "utf-8"})
    return fileBuffer.split(/\r?\n/)
}


// Task 1 code

const extractBitsFromLines = (lines: string[]) => {
    return lines.filter(line => /[0-9]{5}]/g).map(line => line.split("").map(bit => parseInt(bit))).filter(lines => lines.some(number => !isNaN(number)))
}

const aggregateOneCount = (bits: number[][]) => {
    return bits.reduce((aggregate, newVal) => {
        return  aggregate.map((count, index) => count + newVal[index])
        }
    )
}

const decideWinningNumber = (bits: number[][]) => {
    const ones = aggregateOneCount(bits)
    return ones.map(count => 2 * count < bits.length ? "1" : "0")
}

const convertCharArrayToDecimal = (numberArray: string[]) => {
    return parseInt(numberArray.join(""), 2)
}

const task1 = () => {
    const lines = loadLinesFromFile(filename)
    const bits = extractBitsFromLines(lines)
    const gammaRateCharArray = decideWinningNumber(bits)
    const epsilonRateCharArray = gammaRateCharArray.map(char => char === "0" ? "1": "0")
    const gammaRate = convertCharArrayToDecimal(gammaRateCharArray)
    const epsilonRate = convertCharArrayToDecimal(epsilonRateCharArray)
    console.log(`The solution for task 1 is: ${gammaRate * epsilonRate}, gamma rate: ${gammaRate}, epsilon rate: ${epsilonRate}`)
}

//task1()

//  Task 2 code

const task2 = () => {
    const lines = loadLinesFromFile(filename)
    const bits = extractBitsFromLines(lines)
    const [o2, co2] = calcO2andCO2(bits)
    console.log(`The solution for task 2 is: ${o2 * co2}, o2: ${o2}, co2 ${co2}`)
}

function calcO2andCO2(bits: number[][]) {
    const [o2, co2] = splitNumbers(bits, 0)
    return [o2, co2].map(array => convertCharArrayToDecimal(array[0].map(number => number.toString())))
}

function splitNumbers(bits: number[][], index: number): number[][][]{
    const winningNumbers = decideWinningNumber(bits).map(string => parseInt(string))
    console.log("bit length", bits.length)
    const bins = bits.reduce((aggregate:{o2: number[][], co2: number[][]}, newval) => {
        //console.log(aggregate.o2.length, aggregate.co2.length)
        if (newval[index] === winningNumbers[index])
            return {...aggregate, o2: [...aggregate.o2, newval]}
        else
            return {...aggregate, co2: [...aggregate.co2, newval]}
    },{o2: [], co2: []})
    return [bins.o2, bins.co2].map((bin, i) => {
        console.log(`bin: ${bin.length}, index: ${index}, i: ${i}`)
        if (bin.length <= 1) return bin
        console.log("did not return")
        return splitNumbers(bin, index + 1)[i]
    })
    //return {o2: splitNumbers(bins.o2,  index + 1), co2: splitNumbers(bins.co2, index + 1) }
}

task2()
