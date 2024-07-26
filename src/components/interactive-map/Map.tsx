'use client'
import {TileLayer, useMap, ZoomControl} from "react-leaflet";
import {useContext, useEffect, useRef, useState} from "react";
import {Boss, BossFilters} from "@/lib/database/db.model";
import styles from "./map.module.css"
import {AdjustmentsHorizontalIcon} from "@heroicons/react/16/solid";
import {DatabaseContext} from "@/components/App";
import {DixieBoolean, MapLayerEnum, MapLayerType} from "@/lib/types";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {MapMarker} from "@/components/interactive-map/MapMarker";
import {useSearchParams} from "next/navigation";
import {useClickOutside} from "@/lib/useClickOutside";
import {useLiveQuery} from "dexie-react-hooks";

export function ERMap(){
    const params = useSearchParams()
    const db = useContext(DatabaseContext)
    const [displayedMap, setDisplayedMap] = useState<MapLayerType>("OVERWORLD")
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false)
    const [regions, setRegions] = useState<string[]>([])
    const [bossList, setBossList] = useState<Boss[]>([])
    const [filters, setFilters] = useState<BossFilters>({map:displayedMap})
    const map = useMap()
    const filterBox = useRef<HTMLDivElement | null>(null)

    function markerCountFunction(bossId:number, tries:number) {
        db.setTries(bossId, tries)
        loadMarkers()
    }

    function markerSetKilled(bossId:number, isKilled:DixieBoolean){
        db.setDone(bossId, isKilled)
        loadMarkers()
    }

    function loadMarkers(){
        db.getBosses(filters).then(bosses=>{
            setBossList(bosses)
        })
        db.getAllRegions(displayedMap).then(regions=>setRegions(regions))
    }

    useEffect(() => {
        loadMarkers()
    }, [displayedMap, filters, db]);

    useEffect(() => {
        if(params && params.has("boss")){
            const bossId = params.get("boss")!
            try{
                db.getBoss(parseInt(bossId)).then((boss)=>{
                    if(boss){
                        map.flyTo(boss.coordinates, 6)
                    }
                })
            }catch (error){}
        }
    }, [params])

    useClickOutside(()=>{
        setFiltersOpen(false)
    }, filterBox)

    useEffect(() => {
        if(params.has("boss")){
            const id = parseInt(params.get("boss")!)
            db.getBoss(id).then((boss)=>{
                if(!boss){
                    return
                }
                setDisplayedMap(boss.mapLayer)
                setFilters({...filters, map:boss.mapLayer})
            })
        }
    }, [params, db]);

    return <>
        <TileLayer
            url={`/maps/${displayedMap}/{z}/{x}/{y}.png`}
        />
        <ZoomControl position={"topleft"}/>
        {bossList &&
            bossList.map(boss=>{
                    return <MapMarker key={`boss_${boss.id}`}
                               boss={boss}
                               counterFunction={markerCountFunction}
                               setKilled={markerSetKilled}
                    />
                }
            )}
        <div className={`${styles.mapFiltersBox} ${styles['divide-y']} ${!filtersOpen ? styles.close : ""}`} ref={filterBox}>
            {filtersOpen ?
                <XMarkIcon className={`icon ${styles.filtersIcon}`} onClick={()=>setFiltersOpen(!filtersOpen)}/>
                :
                <AdjustmentsHorizontalIcon className={`icon ${styles.filtersIcon}`} onClick={()=>setFiltersOpen(!filtersOpen)}/>
            }
            <div className={`${styles.mapFilters}`}>
                <div className={styles.filterBox}>
                    <b>Map :</b>
                    <select className={"filterInput"}
                            onChange={(e) => {
                                const selectedMap = e.target.value as MapLayerType
                                setFilters({...filters, map: selectedMap, region: undefined})
                                setDisplayedMap(selectedMap)
                            }}
                            value={displayedMap}
                    >
                        {Array.from(Object.entries(MapLayerEnum)).map(([key, value]) => {
                            return <option key={key} value={key}>{value}</option>
                        })}
                    </select>
                </div>
                <div className={styles.filterBox}>
                    <b>Region :</b>
                    <select className={"filterInput"}
                            defaultValue={''}
                            onChange={(e) => setFilters({...filters, region: e.target.value})}>
                        <option value={''}>All</option>
                        {regions?.map((region, index) => {
                            return <option key={`region_${index}`} value={region}>{region}</option>
                        })}
                    </select>
                </div>
                <div className={styles.filterBox}>
                    <b>Nightly :</b>
                    <select className={"filterInput"}
                            onChange={(e) => {
                                if (e.target.value >= 0) {
                                    setFilters({...filters, night: e.target.value as DixieBoolean})
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
                <label className={styles.mapFilter}>Killed :
                    <input type={"checkbox"} onChange={(e) => {
                        if (e.target.checked) {
                            setFilters({...filters, killed: DixieBoolean.true})
                        } else {
                            setFilters({...filters, killed: DixieBoolean.false})
                        }
                    }}/>
                </label>
            </div>
        </div>
    </>
}