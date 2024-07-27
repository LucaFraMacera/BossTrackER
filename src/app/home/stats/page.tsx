'use client'
import React, {Suspense, useContext, useEffect, useState} from 'react';
import {DatabaseContext} from "@/components/App";
import {useLiveQuery} from "dexie-react-hooks";
import styles from "@/app/home/stats/page.module.css"
import mapStyles from "@/components/interactive-map/map.module.css"
import homeStyle from "@/app/home/page.module.css"
import {Accordion} from "@/components/accordion/Accordion";
import {useScreenSize} from "@/lib/useScreenSize";
import {DEFAULT_DATA, getDataSetFromArray} from "@/lib/charts/chart";
import {BossChart} from "@/components/boss-chart/BossChart";
import {Loading} from "@/components/Loading";
import {BossFilters} from "@/lib/database/db.model";
import {MapLayerEnum, MapLayerType} from "@/lib/types";
import {Attribute} from "@/components/Attribute";
import {ProgressBar} from "@/components/progress-bar/ProgressBar";


export default function Stats(){

    const db = useContext(DatabaseContext)
    const regionsDeaths = useLiveQuery(()=>db.getDeathsPerRegion())
    const [filters1, setFilters1] = useState<BossFilters>({map:"OVERWORLD"})
    const [regions, setRegions] = useState<string[]>([])
    const [chartData1, setChartData1] = useState<any>(DEFAULT_DATA)
    const [chartData2, setChartData2] = useState<any>(DEFAULT_DATA)
    const totalBosses = useLiveQuery(()=>db.getTotalBossesCount())
    const totalDefeatedBosses = useLiveQuery(()=> db.getDefeatedBossesCount())
    const mostDifficultBoss = useLiveQuery(()=>db.getMostTriedBoss())
    const totalDeaths = useLiveQuery(()=>db.getTotalDeaths())
    const defeatedBossPerRegion = useLiveQuery(()=>db.getStatsPerRegion())
    const {isSmall} = useScreenSize()

    useEffect(() => {
        if(!regionsDeaths){
            return
        }
        const filteredRegions = regionsDeaths.filter(([region, value])=>value.deaths > 0)
        setChartData1(getDataSetFromArray({
            title:"Deaths Per Region",
            data:filteredRegions.map(([region, value])=>{
                return{
                    label:region,
                    value:value.deaths,
                    satellite:value.mostTried
                }
            }) || [],
            labels:filteredRegions.map(([region, value])=>region) || []
        }))
    }, [regionsDeaths, isSmall]);


    useEffect(() => {
        db.getBosses(filters1).then((bosses)=>{
            setChartData2(getDataSetFromArray({
                title:"Deaths by Bosses",
                data: bosses.map(boss=>{
                    return{
                        label:boss.name,
                        value:boss.tries,
                        satellite:boss
                    }
                }),
                labels: bosses.map(boss=>boss.name)
            }))
        })
        db.getAllRegions(filters1.map).then((regions)=>{
            setRegions(regions)
        })
    }, [filters1])


    return <div className={styles.statsPageBody}>
        <div className={styles.statBox}>
            <h1>General Stats</h1>
            <div className={styles.statBoxInfo}>
                <Attribute className={homeStyle["stat-attribute"]} title={"Total bosses defeated"}
                           text={`${totalDefeatedBosses} / ${totalBosses}`}/>
                <Attribute className={homeStyle["stat-attribute"]} title={"Total deaths"} text={`${totalDeaths}`}/>
                <Attribute className={homeStyle["stat-attribute"]} title={"Most tried boss"}
                           text={mostDifficultBoss ? `${mostDifficultBoss.name}, ${mostDifficultBoss.tries}` : "You haven't tried any boss"}/>
            </div>
            <h1>Progress</h1>
            <div className={styles.statBoxInfo}>
                {defeatedBossPerRegion?.map(value=>{
                    const [mapLayer, regionMap] = value
                    return <Accordion key={`stat_${mapLayer}`} title={mapLayer}>
                        {Array.from(regionMap).map(([region, [defeated, total]])=>{
                            return <ProgressBar key={`progress_${region}`}
                                                max={total} value={defeated}
                                                label={`${region}, ${defeated} / ${total}`}/>
                        })}
                    </Accordion>
                })}
            </div>
        </div>
        <div className={styles.statsPageBodyContent}>
            <h1>Charts</h1>
            <Suspense fallback={<Loading/>}>
                <Accordion title={"Deaths per Region"} isOpen={true}>
                    <BossChart dataset={chartData1} chartType={"line"}/>
                </Accordion>
            </Suspense>
            <Suspense fallback={<Loading/>}>
                <Accordion title={"Deaths By Bosses"}>
                    <div className={mapStyles.filterBox}>
                        <b>Map :</b>
                        <select className={"filterInput"}
                                onChange={(e) => {
                                    const selectedMap = e.target.value as MapLayerType
                                    setFilters1({...filters1, map: selectedMap, region: undefined})
                                }}
                                defaultValue={"OVERWORLD"}
                        >
                            <option value={''}>All</option>
                            {Array.from(Object.entries(MapLayerEnum)).map(([key, value]) => {
                                return <option key={key} value={key}>{value}</option>
                            })}
                        </select>
                    </div>
                    <div className={mapStyles.filterBox}>
                        <b>Region :</b>
                        <select className={"filterInput"}
                                onChange={(e) => {
                                    const selectedRegion = e.target.value
                                    setFilters1({...filters1, region: selectedRegion})
                                }}
                        >
                            <option value={''}>All</option>
                            {regions.map(region => {
                                return <option key={region} value={region}>{region}</option>
                            })}
                        </select>
                    </div>
                    <BossChart dataset={chartData2}/>
                </Accordion>
            </Suspense>
        </div>
    </div>


}