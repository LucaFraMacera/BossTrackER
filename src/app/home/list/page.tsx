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
import {SortButton} from "@/components/sort-button/SortButton";

export default function BossList() {
    const db = useContext(DatabaseContext)
    const regionList = useLiveQuery(() => db.getAllRegions())
    const [currentList, setCurrentList] = useState<Boss[]>([])
    const [clickedBoss, setClickedBoss] = useState<Boss>()
    const [isCardOpen, setCardOpen] = useState<boolean>(false)
    const [filters, setFilters] = useState<BossFilters>({sortBy: ["id", "ASC"]})

    function getList() {
        db.getBosses(filters).then((bosses) => setCurrentList(bosses))
    }

    function openInfoCard(boss: Boss) {
        setClickedBoss(boss)
        setCardOpen(true)
    }

    function changeSortDirection(sortBy: string) {
        const filterSort = filters.sortBy
        if (filterSort) {
            setFilters({...filters, sortBy: [sortBy, filterSort[1] === "ASC" ? "DESC" : "ASC"]})
        } else {
            setFilters({...filters, sortBy: [sortBy, "ASC"]})
        }
    }

    function getSortDirectionFor(attribute: string) {
        return filters.sortBy && filters.sortBy[0] === attribute ? filters.sortBy[1] : undefined
    }

    useEffect(() => {
        getList()
    }, [filters]);


    return <div className={styles.bossList}>
        <div className={styles.filterMenu}>
            <ComplexDropdown title={"Filters"} isVertical={isSmallScreen()}>
                <form className={styles.filters}>
                    <div className={styles.filterInputBox}>
                        <label htmlFor={"region_filter"}><b>Region:</b></label>
                        <select name={"region_filter"} className={"filterInput"}
                                onChange={(e) => setFilters({...filters, region: e.target.value})}
                                defaultValue={undefined}>
                            <option disabled={true}>Select a Region...</option>
                            {regionList?.map(region => {
                                return <option key={`region_${region}`} value={region}>{region}</option>
                            })}
                        </select>
                    </div>
                    <div className={styles.filterInputBox}>
                        <label htmlFor={"killed_filter"}><b>Killed</b>:</label>
                        <select name={"killed_filter"} className={"filterInput"}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value)
                                    if (value >= 0) {
                                        setFilters({...filters, killed: value})
                                    } else {
                                        setFilters({...filters, killed: undefined})
                                    }
                                }}
                                defaultValue={undefined}>
                            <option value={-1}>Indifferent</option>
                            <option value={DixieBoolean.false}>No</option>
                            <option value={DixieBoolean.true}>Yes</option>
                        </select>
                    </div>
                    <div className={styles.filterInputBox}>
                        <label htmlFor={"night_filter"}><b>Nightly</b>:</label>
                        <select name={"night_filter"} className={"filterInput"}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value)
                                    if (value >= 0) {
                                        setFilters({...filters, night: value})
                                    } else {
                                        setFilters({...filters, night: undefined})
                                    }
                                }}
                                defaultValue={undefined}>
                            <option value={-1}>Indifferent</option>
                            <option value={DixieBoolean.false}>No</option>
                            <option value={DixieBoolean.true}>Yes</option>
                        </select>
                    </div>
                    <button onClick={() => {
                        setFilters({})
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
                    <input name={"search_filter"} className={"filterInput"}
                           type="text"
                           placeholder={"Search..."}
                           onChange={(e) => setFilters({...filters, search: e.target.value})}/>
                </div>
                <table className={styles.bossTable}>
                    <thead>
                    <tr>
                        <th><SortButton onClick={() => {
                            changeSortDirection("name")
                        }}
                                        sortDirection={getSortDirectionFor("name")}
                        >Name
                        </SortButton></th>
                        <th><SortButton onClick={() => {
                            changeSortDirection("region")
                        }}
                                        sortDirection={getSortDirectionFor("region")}
                        >Region
                        </SortButton></th>
                        <th><SortButton onClick={() => {
                            changeSortDirection("location")
                        }}
                                        sortDirection={getSortDirectionFor("location")}
                        >Location
                        </SortButton></th>
                        <th><SortButton onClick={() => {
                            changeSortDirection("tries")
                        }}
                                        sortDirection={getSortDirectionFor("tries")}
                        >Tries
                        </SortButton></th>
                        <th><SortButton onClick={() => {
                            changeSortDirection("done")
                        }}
                                        sortDirection={getSortDirectionFor("done")}
                        >Killed
                        </SortButton></th>
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