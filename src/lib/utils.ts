export function isSmallScreen(){
    return window.innerWidth <= 650
}

export function xor(op1:boolean, op2:boolean){
    return (!op1 && op2) || (op1 && !op2)
}

export function getRandomValue(min?:number, max?:number){
    const trueMin = min || 0
    const trueMax = max || Infinity
    return Math.trunc((Math.random()*trueMax)+trueMin)
}

export function arrayToString(arr:any[], separator?:string):string{
    const trueSeparator = separator || ","
    return arr.reduce((previousValue, currentValue)=>{
        return previousValue+trueSeparator+currentValue
    })
}

export function extractFileExtension(filename:string) {
    const regex = /.*\.([a-zA-Z]+)$/
    const matchedGroups = filename.match(regex)
    if(matchedGroups){
        return matchedGroups[1]
    }
    return null
}
