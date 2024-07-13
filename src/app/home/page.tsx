'use client'
import {useContext, useEffect} from "react";
import {DatabaseContext} from "@/app/components/App";
import {useLiveQuery} from "dexie-react-hooks";
import styles from "@/app/home/page.module.css"
import {Dropdown} from "@/app/components/Dropdown";
import {Boss} from "@/app/lib/database/db.model";

interface RegionDataItem{
    region:string
    deaths:number
    mostTried:Boss|undefined
}

export default function Home(){
    const db = useContext(DatabaseContext)
    const totalDeaths = useLiveQuery(()=>db.getTotalDeaths())
    const regionDeaths = useLiveQuery(async ()=>{
        const deathsPerRegion = await db.getTotalDeathsForRegions()
        const regionData:RegionDataItem[] = []
        deathsPerRegion.map(async ([region, value])=>{
            const mostDeaths = await db.getMostDeaths(region)
            if(value > 0){
                regionData.push({
                    region:region,
                    deaths:value,
                    mostTried:mostDeaths
                })
            }
        })
        return regionData;
    })
    const totalBosses = useLiveQuery(()=>db.getTotalBossesCount())
    const totalDefeatedBosses = useLiveQuery(()=> db.getDefeatedBossesCount())
    const nextBossToKill = useLiveQuery(()=> db.getNextBossToKill())
    const mostDifficultBoss = useLiveQuery(()=>db.getMostTriedBoss())


    return <div>
        <fieldset className={styles["stat-fieldset"]}>
            <legend>Next boss</legend>
            <div><b>Boss name</b>: {nextBossToKill?.name}</div>
            <div><b>Where to find it</b>: {nextBossToKill?.region}. {nextBossToKill?.location}</div>
            <div><b>Rewards</b>: {nextBossToKill?.drops.length > 0 ? JSON.stringify(nextBossToKill?.drops) : "Nothing"
            }</div>
        </fieldset>
        <fieldset className={styles["stat-fieldset"]}>
            <legend>General Stats</legend>
            <div><b>Total bosses defeated</b>: {totalDefeatedBosses} / {totalBosses}</div>
            <div><b>Total deaths</b>: {totalDeaths}</div>
            <div><b>Most tried boss</b>: {mostDifficultBoss ? `${mostDifficultBoss.name}, ${mostDifficultBoss.tries}` : "You haven't tried any boss"}
            </div>
        </fieldset>
        <fieldset className={styles["stat-fieldset"]}>
            <legend>Where did you die?</legend>
            {regionDeaths && regionDeaths.length > 0 &&
            regionDeaths.map(data => {
                return <Dropdown key={data.region} title={data.region} items={[
                    {
                        title:"Total Deaths",
                        text: data.deaths.toString()
                    },
                    {
                        title:"Most tried boss",
                        text: `${data.mostTried?.name}`
                    }
                ]}/>
            })
            || <div>You haven&apos;t tried any boss yet.</div>}
        </fieldset>
    </div>
}