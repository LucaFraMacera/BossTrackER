'use client'
import styles from "./page.module.css"
import {useContext, useEffect, useState} from "react";
import {DatabaseContext} from "@/app/components/App";
import {Counter} from "@/app/components/counter/Counter";
import {Boss} from "@/app/lib/database/db.model";
import {DixieBoolean} from "@/app/lib/types";
import {InfoCard} from "@/app/components/info-card/InfoCard";
import {ComplexDropdown} from "@/app/components/dropdown1/CustomDropDown";
import {useLiveQuery} from "dexie-react-hooks";
import {isSmallScreen} from "@/app/lib/utils";


export default function BossList(){
    const db = useContext(DatabaseContext)
    const regionList = useLiveQuery(async ()=>{
        const regionMap = new Map<string, string>()
        const result = await db.getAllRegions()
        result.map(boss => regionMap.set(boss.region, boss.region))
        return Array.from(regionMap.keys())
    })
    const [currentList, setCurrentList] = useState<Boss[]>([])
    const [clickedBoss, setClickedBoss] = useState<Boss>(null)
    const [isCardOpen, setCardOpen] = useState<boolean>(false)
    const [filter, setFilter] = useState<string>('')
    const [regionFilter, setRegionFilter] = useState<string>('')
    const [killedFilter, setKilledFilter] = useState<DixieBoolean | undefined>(undefined)

    function getList(){
        db.bosses.filter(boss=> (boss.name.toLowerCase().includes(filter.toLowerCase()) || boss.location.toLowerCase().includes(filter.toLowerCase())) &&
                                        boss.region.includes(regionFilter) &&
                                        (killedFilter == undefined || boss.done == killedFilter)
                                        )
            .toArray().then(result => {
                setCurrentList(result)
        })
    }

    function openInfoCard(boss:Boss){
        setClickedBoss(boss)
        setCardOpen(true)
    }

    useEffect(() => {
        getList()
    }, [filter, regionFilter, killedFilter]);


    return <div className={styles.bossList}>
        <div className={styles.filterMenu}>
            <ComplexDropdown title={"Filters"} isVertical={isSmallScreen()}>
                <div className={styles.filters}>
                    <div className={styles.filterInputBox}>
                        <label><b>Search</b>:</label>
                        <input className={styles.filterInput}
                               type="text"
                               placeholder={"Search..."}
                               onChange={(e) => setFilter(e.target.value)}/>
                    </div>
                    <div className={styles.filterInputBox}>
                        <label><b>Region:</b></label>
                        <select className={styles.filterInput} onChange={(e) => setRegionFilter(e.target.value)}
                                defaultValue={''} >
                            <option disabled={true}>Select a Region...</option>
                            {regionList?.map(region => {
                                return <option key={`region_${region}`} value={region}>{region}</option>
                            })}
                        </select>
                    </div>
                    <div className={styles.filterInputBox}>
                        <label><b>Killed</b>:</label>
                        <select className={styles.filterInput}
                                onChange={(e) => {
                                    if (e.target.value >= 0) {
                                        setKilledFilter(e.target.value as DixieBoolean)
                                    } else {
                                        setKilledFilter(undefined)
                                    }
                                }}
                                defaultValue={undefined}>
                            <option value={-1}>Indifferent</option>
                            <option value={DixieBoolean.false}>No</option>
                            <option value={DixieBoolean.true}>Yes</option>
                        </select>
                    </div>
                    <button onClick={() => {
                        setFilter('')
                        setKilledFilter(undefined)
                        setRegionFilter('')
                    }}
                            className={styles.filterReset}>Reset
                    </button>
                </div>
            </ComplexDropdown>
        </div>
        <div className={styles.tableAndInfos}>
            <table className={styles.bossTable}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Region</th>
                    <th>Location</th>
                    <th>Tries</th>
                    <th>Killed</th>
                </tr>
                </thead>
                <tbody>
                {currentList && currentList.map(boss => {
                    return <tr key={`boss_${boss.id}`}
                               className={boss.done === DixieBoolean.true ? styles.doneRow : ""}>
                <td onClick={()=>openInfoCard(boss)}>{boss.name}</td>
                        <td onClick={()=>openInfoCard(boss)}>{boss.region}</td>
                        <td onClick={()=>openInfoCard(boss)}>{boss.location}</td>
                        <td><Counter value={boss.tries}
                                     onIncrement={()=>{
                                         db.setTries(boss.id, boss.tries+1)
                                         getList()
                                     }}
                                     onDecrement={()=>{
                                         db.setTries(boss.id, boss.tries-1)
                                         getList()
                                     }}
                                     disabled={boss.done === 1}
                                     min={0}/>
                        </td>
                        <td>
                            <input type={"checkbox"}
                                   defaultChecked={boss.done == 1}
                                   className={styles.checkBox}
                                    onChange={(e)=>{
                                        if(e.target.checked) {
                                            db.setDone(boss.id, DixieBoolean.true)
                                        } else {
                                            db.setDone(boss.id, DixieBoolean.false)
                                        }
                                        getList()
                                    }}/>
                        </td>
                    </tr>
                })}
                </tbody>
            </table>
            <div className={"infoCardBox"}>
                <InfoCard boss={clickedBoss} open={isCardOpen} setOpen={setCardOpen}/>
            </div>
        </div>
    </div>
}