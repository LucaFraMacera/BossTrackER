'use client'
import {CHART_OPTIONS, ChartTypeEnum} from "@/lib/charts/chart";
import {Bar, Bubble, Chart, Doughnut, Line, Pie, PolarArea, Radar, Scatter} from "react-chartjs-2";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartDataset,
    ChartType,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    RadialLinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import React, {useMemo, useState} from "react";
import styles from "@/components/boss-chart/boss-chart.module.css"
import mapStyles from "@/components/interactive-map/map.module.css"
import {Boss} from "@/lib/database/db.model";

interface BossChartProps {
    dataset: ChartDataset<any>
    chartType?: ChartType
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    RadialLinearScale,
    ArcElement,
    PointElement
)
;

export function BossChart({dataset, chartType}: BossChartProps) {

    const [selectedType, setSelectedType] = useState<ChartType>(chartType || "bar")

    return <>
        <div className={mapStyles.filterBox}>
            <b>Chart type:</b>
            <select className={"filterInput"} onChange={(e) => {
                setSelectedType(e.target.value as ChartType)
            }}
                    value={selectedType}
            >
                {Array.from(Object.entries(ChartTypeEnum)).map(([key, value]) => {
                    return <option key={key} value={key.toLowerCase()}>{value}</option>
                })}
            </select>
        </div>
        <ChartBox chartType={selectedType} dataset={dataset}/>
    </>

}


function ChartBox({chartType, dataset}:BossChartProps){
    const chartOptions = {
        ...CHART_OPTIONS,
        plugins: {
            ...(CHART_OPTIONS.plugins),
            legend: {
                display: dataset.labels.length <= 20
            }
        }
    }
    switch (chartType){
        case "pie":
            return <Pie data={dataset} options={chartOptions}/>
        case "line":
            return <Line data={dataset} options={chartOptions}/>
        case "bar":
            return <Bar data={dataset} options={chartOptions}/>
        case "doughnut":
            return <Doughnut data={dataset} options={chartOptions}/>
        default:
            return <div/>
    }
}