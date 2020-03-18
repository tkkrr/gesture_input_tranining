import TaskStrings from "../resource/practice.txt"


const TaskStringsArray = TaskStrings.split("\n")
export const TaskIterator = TaskStringsArray[Symbol.iterator]()