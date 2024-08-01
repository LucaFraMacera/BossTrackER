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
    const mostDifficultBoss = useLiveQuery(()=>db.getMostTriedBoss())
    const nextBossToKill = useLiveQuery(()=> db.getNextBossToKill())


    return <div className={styles["stat-page"]}>
        <div className={styles["stat-box"]}>
            <h1>Next Boss</h1>
            <div className={styles["stat-box-info"]}>
                <Attribute className={styles["stat-attribute"]} title={"Boss name"} text={nextBossToKill?.name || ""}/>
                <Attribute className={styles["stat-attribute"]} title={"Boss location"} text={`${nextBossToKill?.region}, ${nextBossToKill?.location}`}/>
                <Attribute className={styles["stat-attribute"]} title={"Rewards"} text={nextBossToKill && nextBossToKill.drops.length > 0 ? arrayToString(nextBossToKill?.drops!) : "Nothing"}/>
            </div>
            <BossLink className={"bossLink"} bossId={nextBossToKill?.id!} text={"Check map"}/>
        </div>
        <div className={styles["stat-box"]}>
            <h1>General Stats</h1>
            <div className={styles["stat-box-info"]}>
                <Attribute className={styles["stat-attribute"]} title={"Total bosses defeated"} text={`${totalDefeatedBosses} / ${totalBosses}`}/>
                <Attribute className={styles["stat-attribute"]} title={"Total deaths"} text={`${totalDeaths}`}/>
                <Attribute className={styles["stat-attribute"]} title={"Most tried boss"} text={mostDifficultBoss ? `${mostDifficultBoss.name}, ${mostDifficultBoss.tries}` : "You haven't died to a boss yet"}/>
            </div>
            <Link className={"bossLink"} href={"/home/stats"}>Check all</Link>
        </div>
        <div className={styles["stat-box"]}>
            <h1>Where did you die?</h1>
            <div className={`${styles["stat-box-info"]} ${styles["stat-box-dropdown"]}`}>
                {regionDeaths && regionDeaths.length > 0 ?
                        regionDeaths.map(([region, regionData]) => {
                            if(regionData.deaths > 0){
                                return <Accordion key={region} title={region}>
                                    <Attribute className={styles["stat-attribute"]} title={"Total Deaths"} text={`${regionData.deaths}`}/>
                                    <Attribute className={styles["stat-attribute"]} title={"Most tried boss"} text={`${regionData.mostTried?.name}, ${regionData.mostTried?.tries}`}/>
                                </Accordion>
                            }
                        }):
                    <div>You haven&apos;t tried any boss yet.</div>}
            </div>
        </div>
    </div>
}