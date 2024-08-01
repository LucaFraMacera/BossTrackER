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
import {NgModal} from "@/components/ng-modal/NgModal";


export default function Stats() {

    const db = useContext(DatabaseContext)
    const regionsDeaths = useLiveQuery(() => db.getDeathsPerRegion())
    const [filters1, setFilters1] = useState<BossFilters>({map: "OVERWORLD"})
    const [regions, setRegions] = useState<string[]>([])
    const [chartData1, setChartData1] = useState<any>(DEFAULT_DATA)
    const [chartData2, setChartData2] = useState<any>(DEFAULT_DATA)
    const totalBosses = useLiveQuery(() => db.getTotalBossesCount())
    const totalDefeatedBosses = useLiveQuery(() => db.getDefeatedBossesCount())
    const mostDifficultBoss = useLiveQuery(() => db.getMostTriedBoss())
    const totalDeaths = useLiveQuery(() => db.getTotalDeaths())
    const defeatedBossPerRegion = useLiveQuery(() => db.getStatsPerMap())
    const currentNG = useLiveQuery(() => db.getCurrentNGLevel())
    const ngHistory = useLiveQuery(() => db.getNgHistory())
    const canProgressNG = useLiveQuery(()=>db.canProgressNgLevel())
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const {isSmall} = useScreenSize()

    function getBossToDeathRatio() {
        const deaths = totalDeaths || 1
        const totalBosses = totalDefeatedBosses || 0
        return (totalBosses / Math.max(1, deaths)).toFixed(2)
    }

    useEffect(() => {
        if (!regionsDeaths) {
            return
        }
        const filteredRegions = regionsDeaths.filter(([region, value]) => value.deaths > 0)
        setChartData1(getDataSetFromArray({
            title: "Deaths Per Region",
            data: filteredRegions.map(([region, value]) => {
                return {
                    label: region,
                    value: value.deaths,
                    satellite: value.mostTried
                }
            }) || [],
            labels: filteredRegions.map(([region, value]) => region) || []
        }))
    }, [regionsDeaths, isSmall]);


    useEffect(() => {
        db.getBosses(filters1).then((bosses) => {
            setChartData2(getDataSetFromArray({
                title: "Deaths by Bosses",
                data: bosses.map(boss => {
                    return {
                        label: boss.name,
                        value: boss.tries,
                        satellite: boss
                    }
                }),
                labels: bosses.map(boss => boss.name)
            }))
        })
        db.getAllRegions(filters1.map).then((regions) => {
            setRegions(regions)
        })
    }, [filters1])


    return <div className={styles.statsPageBody}>
        <NgModal isOpen={modalOpen} setOpen={setModalOpen}
                 title={"Continue your journey"}
                 text={`Do you want to progress to NG+ ${currentNG?.level + 1}`}
                 onConfirm={() => {
                     db.resetBosses()
                 }}
        />
        <div className={styles.statBox}>
            <h1>General Stats</h1>
            <div className={styles.statBoxInfo}>
                <Attribute className={homeStyle["stat-attribute"]} title={"Total bosses defeated"}
                           text={`${totalDefeatedBosses} / ${totalBosses}`}/>
                <Attribute className={homeStyle["stat-attribute"]} title={"Total deaths"} text={`${totalDeaths}`}/>
                <Attribute className={homeStyle["stat-attribute"]} title={"Most tried boss"}
                           text={mostDifficultBoss ? `${mostDifficultBoss.name}, ${mostDifficultBoss.tries}` : "You haven't died to a boss yet"}/>
                <Attribute className={homeStyle["stat-attribute"]} title={"Boss to death ratio"}
                           text={`${getBossToDeathRatio()}`}/>
                <Attribute className={homeStyle["stat-attribute"]} title={"Current NG+ level"}
                           text={`${currentNG?.level || 0}`}/>
                <Attribute className={homeStyle["stat-attribute"]} title={"Start date"}
                           text={`${currentNG?.startDate}`}/>
            </div>
        </div>
        <div className={styles.statBox}>
            <h1>Progress</h1>
            <div className={styles.statBoxInfo}>
                {defeatedBossPerRegion?.map(value => {
                    const [mapLayer, regionMap] = value
                    return <Accordion key={`stat_${mapLayer}`} title={MapLayerEnum[mapLayer]}>
                        {Array.from(regionMap).map(([region, [defeated, total]]) => {
                            return <ProgressBar key={`progress_${region}`}
                                                max={total} value={defeated}
                                                label={`${region}, ${defeated} / ${total}`}/>
                        })}
                    </Accordion>
                })}
            </div>
            {
                (canProgressNG || totalDefeatedBosses === totalBosses) &&
                <div className={styles.statResetBox}>
                    <h1>Continue your Journey</h1>
                    <p>
                        You&apos;ve managed to defeat the final boss of Elden Ring.
                        You can now advance to the next stage of your adventure.
                        Click the button below to advance to <b>New Game+ {currentNG?.level + 1}</b>
                    </p>
                    <button className={"bossLink"}
                            onClick={() => setModalOpen(true)}
                    >Progress
                    </button>
                </div>
            }
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
        <div className={styles.statBox}>
            <h1>History</h1>
            {
                ngHistory && ngHistory?.length > 0 ?
                    <div className={styles.statBoxInfo}>
                        {ngHistory.map((ngLevel) => {
                            return ngLevel.endDate &&
                                <Accordion key={`ng_${ngLevel.level}`} title={`New Game Plus ${ngLevel.level}`}>
                                    <div className={styles.statBoxInfo}>
                                        <Attribute className={homeStyle["stat-attribute"]} title={"Total boss defeated"}
                                                   text={`${ngLevel.defeatedBossesCount || 0}`}/>
                                        <Attribute className={homeStyle["stat-attribute"]} title={"Total deaths"}
                                                   text={`${ngLevel.deaths}`}/>
                                        <Attribute className={homeStyle["stat-attribute"]} title={"Boss to death ratio"}
                                                   text={`${ngLevel.bossDeathRatio}`}/>
                                        <Attribute className={homeStyle["stat-attribute"]} title={"Start date"}
                                                   text={`${ngLevel.startDate}`}/>
                                        <Attribute className={homeStyle["stat-attribute"]} title={"End date"}
                                                   text={`${ngLevel.endDate}`}/>
                                        <Attribute className={homeStyle["stat-attribute"]} title={"Most tried boss"}
                                                   text={ngLevel.mostDifficult ? `${ngLevel.mostDifficult.name}, ${ngLevel.mostDifficult.tries}` : "You haven't died to any boss!"}/>
                                    </div>
                                </Accordion>
                        })}
                    </div>
                    :
                    <label>There is no history present.</label>
            }
        </div>
    </div>


}