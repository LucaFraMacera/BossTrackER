'use client'
import React, {useContext, useEffect, useState} from 'react';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS, ChartData, ChartOptions,
    Legend,
    LinearScale,
    RadialLinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import {Bar, Chart, Pie, PolarArea} from 'react-chartjs-2';
import {DatabaseContext} from "@/components/App";
import {useLiveQuery} from "dexie-react-hooks";
import styles from "@/app/home/stats/page.module.css"
import {Accordion} from "@/components/accordion/Accordion";
import {useScreenSize} from "@/lib/useScreenSize";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    ArcElement
);

const DEFAULT_DATA:ChartData = {
    labels: [],
    datasets:[]
}

const CHART_OPTIONS:ChartOptions<any> = {
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

export default function Stats(){

    const db = useContext(DatabaseContext)
    const regions = useLiveQuery(()=>db.getAllRegions())
    const regionsDeaths = useLiveQuery(()=>db.getDeathsPerRegion())
    const [chartData, setChartData] = useState<any>(DEFAULT_DATA)
    const {isSmall} = useScreenSize()

    useEffect(() => {
        setChartData({
            labels: regions || [],
            datasets:[
                {
                    label: 'Dataset 1',
                    data: regions?.map(() => Math.random()*100),
                    backgroundColor: getChartDataColors(regions || []),
                    borderWidth:2,
                    borderColor:getChartDataColors(regions || [], true)
                }
            ]
        })
    }, [regions, isSmall]);


    return <div className={styles.statsPageBody}>
        <Accordion title={"Filters"}>
            <div>
                <button>Map</button>
            </div>
            <div>
                <button>Map</button>
            </div>
            <div>
                <button>Map</button>
            </div>
            <div>
                <button>Map</button>
            </div>
        </Accordion>
        <Bar options={CHART_OPTIONS} data={chartData} className={styles.chart}/>
        {regionsDeaths ?
            <>
                <Accordion title={"Filters"}>
                    <div>
                        <button>Map</button>
                    </div>
                    <div>
                        <button>Map</button>
                    </div>
                    <div>
                        <button>Map</button>
                    </div>
                    <div>
                        <button>Map</button>
                    </div>
                    <Bar options={CHART_OPTIONS} data={chartData} className={styles.chart}/>
                </Accordion>
            </>
            :
            <label>Loading....</label>
        }
    </div>


}