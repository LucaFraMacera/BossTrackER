'use client'

import {Boss} from "@/app/lib/database/db.model";
import {Dispatch, SetStateAction} from "react";
import styles from "./info-card.module.css"
import {Attribute} from "@/app/components/Attribute";
import {XMarkIcon} from "@heroicons/react/24/outline";

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
                            onClick={()=>setOpen(false)}/>
            </div>
            <div className={styles.infoCardInfos}>
                <Attribute title={"Boss Name"} text={boss?.name || ""} className={styles.infoCardAttribute}/>
                <Attribute title={"Region"} text={boss?.region || ""} className={styles.infoCardAttribute}/>
                <Attribute title={"Location"} text={boss?.location || ""} className={styles.infoCardAttribute}/>
                <Attribute title={"Additional Info"} text={boss?.notes || "No additional info."}
                           className={styles.infoCardAttribute}/>
                <div className={styles.dropsInfo}>
                    <b>Drops:</b>
                    <ul>
                        {boss?.drops.length > 0 && boss?.drops.map((drop, index) => {
                                return <li key={`drop_${index}`}>{drop}</li>
                            })
                            || "No additional drops."}
                    </ul>
                </div>
            </div>
        </div>
    </div>
}