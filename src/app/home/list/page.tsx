'use client'
import {useContext} from "react";
import {DatabaseContext} from "@/app/components/App";
import {useLiveQuery} from "dexie-react-hooks";

export default function BossList(){
    const db = useContext(DatabaseContext)
    const list = useLiveQuery(()=>db.bosses.toArray())

    return <div>
        {list &&
            list?.map(boss=>
                <div key={boss.id}>{boss.name}, {boss.region}, {boss.location}</div>
            )}
    </div>
}