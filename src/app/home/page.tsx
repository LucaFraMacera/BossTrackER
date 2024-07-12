'use client'
import {useContext} from "react";
import {DatabaseContext} from "@/app/components/App";
import {useLiveQuery} from "dexie-react-hooks";
import styles from "@/app/home/page.module.css"
import {IconKeys} from "next/dist/lib/metadata/constants";
import Image from "next/image";
import {Icon} from "@/app/components/Icon";
import {Dropdown} from "@/app/components/Dropdown";

export default function Home(){
    const db = useContext(DatabaseContext)
    const totalDeaths = useLiveQuery(()=>db.getTotalDeaths())
    const regionDeaths = useLiveQuery(()=>db.getTotalDeathsForRegions())
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
            <div><Icon src={"/icons/hasty-grave.svg"}/><b>Total deaths</b>: {totalDeaths}</div>
            <div><Icon src={"/icons/warlord-helmet.svg"}/><b>Most tried boss</b>: {mostDifficultBoss ? `${mostDifficultBoss.name}, ${mostDifficultBoss.tries}` : "You haven't tried any boss"}
            </div>
        </fieldset>
        <fieldset className={styles["stat-fieldset"]}>
            <legend>Where did you die?</legend>
            {regionDeaths && regionDeaths.map(([region, deaths])=>{
                return <Dropdown key={region} title={region} items={[{
                        title:region,
                        text:"Total deaths: "+deaths
                }
                ]}/>
            })}
        </fieldset>
    </div>
}