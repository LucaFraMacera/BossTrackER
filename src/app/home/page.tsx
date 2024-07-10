'use client'
import {useContext, useEffect, useState} from "react";
import {DatabaseContext} from "@/app/components/App";
import {useLiveQuery} from "dexie-react-hooks";

export default function Home(){
    const db = useContext(DatabaseContext)
    const totalDeaths = useLiveQuery(()=>db.getTotalDeaths())
    const regionDeaths = useLiveQuery(()=>db.getTotalDeathsForRegions())
    const totalBosses = useLiveQuery(()=>db.getTotalBossesCount())
    const totalDefeatedBosses = useLiveQuery(()=> db.getDefeatedBossesCount())
    const nextBossToKill = useLiveQuery(()=> db.getNextBossToKill())

    return <div>
        <div>
            Total Bosses Defeated: {totalDefeatedBosses} / {totalBosses}
        </div>
        <div>
            Total Deaths: {totalDeaths}
        </div>
        <div>
            Next Boss in line: {nextBossToKill?.name}
        </div>
        <div>
            Where did you die?
            <div>
                {regionDeaths && regionDeaths.map(([region, deaths]) =>{
                    return <div key={region}>
                        {region}: {deaths}
                    </div>
                })}
            </div>
        </div>
    </div>
}