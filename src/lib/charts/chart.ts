import {ChartData, ChartOptions} from "chart.js";
import {externalTooltipHandler} from "@/components/boss-chart/externalTooltip";
import {ChartDataValue, ChartValues} from "@/lib/charts/chart.model";
import {getRandomValue} from "@/lib/utils";

export interface DataSet {
    title: string
    labels: string[]
    data: ChartDataValue[]
}

export enum ChartTypeEnum {
    BAR = "Bar chart", PIE = "Pie chart", LINE = "Line chart", DOUGHNUT = "Doughnut chart"
}


export const DEFAULT_DATA: ChartData = {
    labels: [],
    datasets: []
}


export const CHART_OPTIONS: ChartOptions<any> = {
    plugins: {
        title: {
            display: false,
        },
        tooltip: {
            enabled: false,
            position: "nearest",
            external: externalTooltipHandler,
            callbacks: {
                title: ([data]:any) => {
                    const {raw} = data
                    if (raw.satellite) {
                        return raw.satellite.name
                    } else {
                        return raw.label
                    }
                }
            }
        },
    },
    responsive: true,
    parsing: {
        xAxisKey: "label",
        yAxisKey: "value",
        key: "value"
    },
    interactions: {
        axis: "xy",
        mode: "nearest"
    },
    scales: {
        y: {
            min: 0
        }
    }
};


const PRIMARY_COLOR = "rgba(255,229,178,0.81)"
const SECONDARY_COLOR = "rgba(255,241,14,0.54)"

function getChartDataColors(data: any[]) {
    return data.map(value => `rgb(${getRandomValue(150, 256)}, ${getRandomValue(100, 200)}, ${getRandomValue(50, 179)})`)
}

export function getDataSetFromArray({title, labels, data}: DataSet): ChartValues {
    const colors = getChartDataColors(data)
    return {
        name: title,
        labels: labels,
        datasets: [
            {
                label: title,
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: colors
            }
        ]
    }
}