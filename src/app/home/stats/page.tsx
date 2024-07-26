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
import {CHART_OPTIONS, DEFAULT_DATA, getDataSetFromArray} from "@/lib/charts/chartUtils";

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

export default function Stats(){

    const db = useContext(DatabaseContext)
    const regions = useLiveQuery(()=>db.getAllRegions())
    const regionsDeaths = useLiveQuery(()=>db.getDeathsPerRegion())
    const [chartData, setChartData] = useState<any>(DEFAULT_DATA)
    const {isSmall} = useScreenSize()

    useEffect(() => {
        setChartData(getDataSetFromArray({
            title:"Region Deaths",
            data: regions?.map(()=>Math.random()*101) || [],
            labels: regions || []
        }))
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