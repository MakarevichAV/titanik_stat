import fs from 'node:fs';
import readline from "node:readline";

const fileStream = fs.createReadStream('./train.csv', 'utf-8');
const reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
})

const stat = {
    pasNumber:  {class1: 0, class2: 0, class3: 0},
    totalFares: {class1: 0, class2: 0, class3: 0,},
    men:        {survived: 0, nonSurvived: 0},
    women:      {survived: 0, nonSurvived: 0},
    children:   {survived: 0, nonSurvived: 0}
}
let isFirstLine = true;
reader.on('line', (line) => {
    if (isFirstLine) {
        isFirstLine = false;
        return
    }
    const pas = line.split(',')
    switch (+pas[2]) {
        case 1:
            stat.pasNumber.class1++
            stat.totalFares.class1 += +pas[10]
            break
        case 2:
            stat.pasNumber.class2++
            stat.totalFares.class2 += +pas[10]
            break
        case 3:
            stat.pasNumber.class3++
            stat.totalFares.class3 += +pas[10]
            break
    }

    let group
    if (+pas[6] < 18) group = 'children'
    else if (pas[5] === 'male') group = 'men'
    else group = 'women'

    if (+pas[1]) stat[group].survived++
    else stat[group].nonSurvived++
})

reader.on('close', () => {
    stat.totalFares.total = stat.totalFares.class1 + stat.totalFares.class2 + stat.totalFares.class3
    stat.avgClass1 = stat.totalFares.class1/stat.pasNumber.class1
    stat.avgClass2 = stat.totalFares.class2/stat.pasNumber.class2
    stat.avgClass3 = stat.totalFares.class3/stat.pasNumber.class3

    console.log(`Total fares: ${stat.totalFares.total}\n`)
    console.log(`Average fare for 1 class: ${stat.avgClass1}\nAverage fare for 2 class: ${stat.avgClass2}\nAverage fare for 3 class: ${stat.avgClass3}\n`)
    console.log(`Survived men: ${stat.men.survived}\nNon survived men: ${stat.men.nonSurvived}\n`)
    console.log(`Survived women: ${stat.women.survived}\nNon survived women: ${stat.women.nonSurvived}\n`)
    console.log(`Survived children: ${stat.children.survived}\nNon survived children: ${stat.children.nonSurvived}\n`)
})