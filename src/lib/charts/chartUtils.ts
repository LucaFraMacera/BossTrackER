import {ChartData, ChartOptions} from "chart.js";

interface DataSet{
    title:string
    labels:string[]
    data:any[]
}


export const DEFAULT_DATA:ChartData = {
    labels: [],
    datasets:[]
}

export const CHART_OPTIONS:ChartOptions<any> = {
    plugins: {
        title: {
            display: true,
            text: '',
        },
    },
    responsive: true,
};

const PRIMARY_COLOR = "rgba(255,211,100,0.81)"
const SECONDARY_COLOR = "rgba(255,211,100,0.54)"

function getChartDataColors(data:any[], inverse?:boolean){
    const isInverse = inverse != undefined ? inverse : false
    if(!isInverse){
        return data.map((region, index)=>index % 2 ? PRIMARY_COLOR : SECONDARY_COLOR)
    }
    return data.map((region, index)=>index % 2==0 ? PRIMARY_COLOR : SECONDARY_COLOR)
}

export function getDataSetFromArray({title, labels, data}:DataSet){
    return {
        labels: labels,
        datasets:[
            {
                label: title,
                data: data,
                backgroundColor: getChartDataColors(data),
                borderWidth:2,
                borderColor:getChartDataColors(data, true)
            }
        ]
    }
}