import {ChartConfiguration, ChartData, ChartOptions} from "chart.js";
import {externalTooltipHandler} from "@/components/boss-chart/externalTooltip";
import {ChartDataset, ChartDataValue, ChartValues} from "@/lib/charts/chart.model";

export interface DataSet{
    title:string
    labels:string[]
    data:ChartDataValue[]
}

export enum ChartTypeEnum{
    BAR="Bar chart", PIE="Pie chart", LINE="Line chart"
}


export const DEFAULT_DATA:ChartData = {
    labels: [],
    datasets:[]
}



export const CHART_OPTIONS:ChartOptions<any> = {
    plugins: {
        title: {
            display: false,
        },
        tooltip:{
            enabled:false,
            position: 'nearest',
            external: externalTooltipHandler
        },
    },
    responsive: true,
    parsing:{
        xAxisKey:"label",
        yAxisKey: "value",
        key: "value"
    },
    scales:{
        y:{
            min:0
        }
    }
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

export function getDataSetFromArray({title, labels, data}:DataSet):ChartValues{
    return {
        name:title,
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