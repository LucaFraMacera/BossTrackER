'use client'
import styles from "./page.module.css"
import {useContext, useEffect, useState} from "react";
import {DatabaseContext} from "@/components/App";
import {Counter} from "@/components/counter/Counter";
import {Boss, BossFilters} from "@/lib/database/db.model";
import {DixieBoolean} from "@/lib/types";
import {InfoCard} from "@/components/info-card/InfoCard";
import {ComplexDropdown} from "@/components/dropdown/CustomDropDown";
import {useLiveQuery} from "dexie-react-hooks";
import {isSmallScreen} from "@/lib/utils";
import {MagnifyingGlassIcon} from "@heroicons/react/16/solid";


export default function BossList(){
    const db = useContext(DatabaseContext)
    const regionList = useLiveQuery(()=>db.getAllRegions())
    const [currentList, setCurrentList] = useState<Boss[]>([])
    const [clickedBoss, setClickedBoss] = useState<Boss>(null)
    const [isCardOpen, setCardOpen] = useState<boolean>(false)
    const [filter, setFilter] = useState<string>('')
    const [regionFilter, setRegionFilter] = useState<string>('')
    const [killedFilter, setKilledFilter] = useState<DixieBoolean | undefined>(undefined)
    const [nightFilter, setNightFilter] = useState<DixieBoolean | undefined>(undefined)
    function getList(){
        const filters:BossFilters ={
            search:filter,
            region:regionFilter,
            killed:killedFilter,
            night:nightFilter
        }
        db.getBosses(filters).then((bosses)=>setCurrentList(bosses))
    }

    function openInfoCard(boss:Boss){
        setClickedBoss(boss)
        setCardOpen(true)
    }

    useEffect(() => {
        getList()
    }, [filter, regionFilter, killedFilter, nightFilter]);


    return <div className={styles.bossList}>
        <div className={styles.filterMenu}>
            <ComplexDropdown title={"Filters"} isVertical={isSmallScreen()}>
                <form className={styles.filters}>
                    <div className={styles.filterInputBox}>
                        <label><b>Region:</b></label>
                        <select className={"filterInput"} onChange={(e) => setRegionFilter(e.target.value)}
                                defaultValue={''}>
                            <option disabled={true}>Select a Region...</option>
                            {regionList?.map(region => {
                                return <option key={`region_${region}`} value={region}>{region}</option>
                            })}
                        </select>
                    </div>
                    <div className={styles.filterInputBox}>
                        <label><b>Killed</b>:</label>
                        <select className={"filterInput"}
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
                    <div className={styles.filterInputBox}>
                        <label><b>Nightly</b>:</label>
                        <select className={"filterInput"}
                                onChange={(e) => {
                                    if (e.target.value >= 0) {
                                        setNightFilter(e.target.value as DixieBoolean)
                                    } else {
                                        setNightFilter(undefined)
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
                            className={"filterReset"} type={"reset"}>Reset
                    </button>
                </form>
            </ComplexDropdown>
        </div>
        <div className={styles.tableAndInfos}>
            <div className={styles.bossTableBox}>
                <div className={styles.searchBox}>
                    <MagnifyingGlassIcon className={"icon"}/>
                    <input className={"filterInput"}
                           type="text"
                           placeholder={"Search..."}
                           onChange={(e) => setFilter(e.target.value)}/>
                </div>
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
                            <td onClick={() => openInfoCard(boss)}>{boss.name}</td>
                            <td onClick={() => openInfoCard(boss)}>{boss.region}</td>
                            <td onClick={() => openInfoCard(boss)}>{boss.location}</td>
                            <td><Counter value={boss.tries}
                                         onIncrement={() => {
                                             db.setTries(boss.id, boss.tries + 1)
                                             getList()
                                         }}
                                         onDecrement={() => {
                                             db.setTries(boss.id, boss.tries - 1)
                                             getList()
                                         }}
                                         disabled={boss.done === 1}
                                         min={0}/>
                            </td>
                            <td>
                                <input type={"checkbox"}
                                       defaultChecked={boss.done == 1}
                                       className={styles.checkBox}
                                       onChange={(e) => {
                                           if (e.target.checked) {
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
            </div>
            <div className={"infoCardBox"}>
                <InfoCard boss={clickedBoss} open={isCardOpen} setOpen={setCardOpen}/>
            </div>
        </div>
    </div>
}