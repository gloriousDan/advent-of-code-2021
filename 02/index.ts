import {readFileSync} from "fs";

const filename = "input.txt"

type Command = {direction: "forward" | "down" | "up", amount: number}

const loadLinesFromFile =  () => {
    const fileBuffer = readFileSync(filename, {encoding: "utf-8"})
    return fileBuffer.split(/\r?\n/)
}



const extractCommandsFromLines = (lines: string[])=> {
    const commands = lines.map(line => {
        const split = line.split(" ")
        return {
            direction: split[0],
            amount: parseInt(split[1]),
        }
    })
    return commands.filter(command => /(?:forward)|(?:up)|(?:down)/g.test(command.direction)) as Command[]
}

const calcSubPosition = (commands: Command[]) => {
    return commands.reduce((subPosition, currentCommand) => {
        if (currentCommand.direction === "forward")
            return {...subPosition, distance: subPosition.distance + currentCommand.amount}
        if (currentCommand.direction === "up")
            return {...subPosition, depth: subPosition.depth - currentCommand.amount}
        if (currentCommand.direction === "down")
            return {...subPosition, depth: subPosition.depth + currentCommand.amount}
        return subPosition
    }, {depth: 0, distance: 0})
}

// Task 1 code

const task1 = () => {
    const lines = loadLinesFromFile()
    const commands = extractCommandsFromLines(lines)
    const result =  calcSubPosition(commands)
    console.log(`The solution for task 1 is: ${result.depth * result.distance} with a depth of ${result.depth} and a distance of ${result.distance}`)

}

task1()

//  Task 2 code

function calcSubPositionWithAim(commands: Command[]) {
    return commands.reduce((subPosition, currentCommand) => {
        if (currentCommand.direction === "forward")
            return {...subPosition, distance: subPosition.distance + currentCommand.amount, depth: subPosition.depth + currentCommand.amount * subPosition.aim}
        if (currentCommand.direction === "up")
            return {...subPosition, aim: subPosition.aim - currentCommand.amount}
        if (currentCommand.direction === "down")
            return {...subPosition, aim: subPosition.aim + currentCommand.amount}
        return subPosition
    }, {depth: 0, distance: 0, aim: 0})
}

const task2 = () => {
    const lines = loadLinesFromFile()
    const commands = extractCommandsFromLines(lines)
    const result = calcSubPositionWithAim(commands)
    console.log(`The solution for task 2 is: ${result.depth * result.distance} with a depth of ${result.depth} and a distance of ${result.distance}`)
}

task2()
