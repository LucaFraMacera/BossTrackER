'use client'

import {Boss} from "@/lib/database/db.model";
import {Dispatch, SetStateAction} from "react";
import styles from "./info-card.module.css"
import {Attribute} from "@/components/Attribute";
import {XMarkIcon} from "@heroicons/react/24/outline";
import style from "@/components/interactive-map/map.module.css";
import {DixieBoolean} from "@/lib/types";
import {arrayToString} from "@/lib/utils";
import {BossLink} from "@/components/boss-link/BossLink";

interface  InfoCardProps{
    boss?:Boss
    open:boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}
export function InfoCard({boss, open, setOpen}:InfoCardProps){
    return <div className={styles.infoCardBox} style={{display: open ? "flex" : "none"}}>
        <div className={styles.infoCard}>
            <div className={styles.infoCardClose}>
                <XMarkIcon className={"icon close-icon"}
                           onClick={() => setOpen(false)}/>
            </div>

            <div className={`${style.markerInfos}`}>
                <h1 className={style.markerTitle}>{boss?.name}</h1>
               <div className={style.markerBossInfo}>
                   <Attribute title={"Region"} text={`${boss?.region}`} className={style.markerBossAttribute}/>
                   <Attribute title={"Location"} text={`${boss?.location}`} className={style.markerBossAttribute}/>
                   <Attribute title={"Drops"} text={boss?.drops?.length > 0 ? arrayToString(boss?.drops!) : "No drops."}
                              className={style.markerBossAttribute}/>
                   <Attribute title={"Notes"} text={boss?.notes || "No additional information."}
                              className={style.markerBossAttribute}/>
               </div>
                <BossLink bossId={boss?.id!} text={"Check map"}/>
            </div>
        </div>
    </div>
}