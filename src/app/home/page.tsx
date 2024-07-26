'use client'
import {useContext, useEffect} from "react";
import {DatabaseContext} from "@/components/App";
import {useLiveQuery} from "dexie-react-hooks";
import styles from "@/app/home/page.module.css"
import {Accordion} from "@/components/accordion/Accordion";
import {Boss} from "@/lib/database/db.model";
import Link from "next/link";
import {Attribute} from "@/components/Attribute";
import {arrayToString} from "@/lib/utils";
import {BossLink} from "@/components/boss-link/BossLink";

export default function Home(){
    const db = useContext(DatabaseContext)
    const totalDeaths = useLiveQuery(()=>db.getTotalDeaths())
    const regionDeaths = useLiveQuery(async ()=>db.getDeathsPerRegion())
    const totalBosses = useLiveQuery(()=>db.getTotalBossesCount())
    const totalDefeatedBosses = useLiveQuery(()=> db.getDefeatedBossesCount())
    const nextBossToKill = useLiveQuery(()=> db.getNextBossToKill())
    const mostDifficultBoss = useLiveQuery(()=>db.getMostTriedBoss())


    return <div className={styles["stat-page"]}>
        <fieldset className={styles["stat-fieldset"]}>
            <legend>Next boss</legend>
            <Attribute className={styles["stat-attribute"]} title={"Boss name"} text={nextBossToKill?.name || ""}/>
            <Attribute className={styles["stat-attribute"]} title={"Boss location"} text={`${nextBossToKill?.region}, ${nextBossToKill?.location}`}/>
            <Attribute className={styles["stat-attribute"]} title={"Rewards"} text={nextBossToKill?.drops.length > 0 ? arrayToString(nextBossToKill?.drops!) : "Nothing"}/>
            <BossLink className={styles.bossMapLink} bossId={nextBossToKill?.id!} text={"Check map"}/>
        </fieldset>
        <fieldset className={styles["stat-fieldset"]}>
            <legend>General Stats</legend>
            <Attribute className={styles["stat-attribute"]} title={"Total bosses defeated"} text={`${totalDefeatedBosses} / ${totalBosses}`}/>
            <Attribute className={styles["stat-attribute"]} title={"Total deaths"} text={`${totalDeaths}`}/>
            <Attribute className={styles["stat-attribute"]} title={"Most tried boss"} text={mostDifficultBoss ? `${mostDifficultBoss.name}, ${mostDifficultBoss.tries}` : "You haven't tried any boss"}/>
        </fieldset>
        <fieldset className={styles["stat-fieldset"]}>
            <legend>Where did you die?</legend>
            {(regionDeaths && regionDeaths.length > 0 &&
            regionDeaths.map(([region, regionData]) => {
                if(regionData.deaths > 0){
                    return <Accordion key={region} title={region}>
                        <Attribute className={styles["stat-attribute"]} title={"Total Deaths"} text={`${regionData.deaths}`}/>
                        <Attribute className={styles["stat-attribute"]} title={"Most tried boss"} text={`${regionData.mostTried?.name}, ${regionData.mostTried?.tries}`}/>
                    </Accordion>
                }
            }))
            || <div>You haven&apos;t tried any boss yet.</div>}
        </fieldset>
    </div>
}