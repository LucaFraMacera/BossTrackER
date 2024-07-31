import {Boss} from "@/lib/database/db.model";
import {icon} from "leaflet";
import {Marker, Popup} from "react-leaflet";
import {Attribute} from "@/components/Attribute";
import {Counter} from "@/components/counter/Counter";
import style from "@/components/interactive-map/map.module.css"
import {DixieBoolean} from "@/lib/types";
import {arrayToString} from "@/lib/utils";


interface MapMarkerProps{
    boss:Boss,
    counterFunction?:(bossId:number, tries:number)=>void
    setKilled?:(bossId:number, killed:DixieBoolean)=>void
}

export function MapMarker({boss, counterFunction, setKilled}:MapMarkerProps){

    function getMarkerDoneClass(boss:Boss){
        return boss.done === DixieBoolean.true ? "boss-marker-killed" : ""
    }


    const REMEMBRANCE_MARKER = icon({
        iconUrl: "/icons/remembrance_marker"+(boss.done == DixieBoolean.true ? "_done" : "") + ".png",
        iconAnchor:[17.5,40],
        iconSize: [35, 40],
        className:getMarkerDoneClass(boss)
    })

    const INVADER_MARKER = icon({
        iconUrl: "/icons/invasion_marker"+(boss.done == DixieBoolean.true ? "_done" : "") + ".png",
        iconAnchor:[17.5,40],
        iconSize: [35, 40],
        className:getMarkerDoneClass(boss)
    })

    const OPTIONAL_MARKER = icon({
        iconUrl: "/icons/optional_marker"+(boss.done == DixieBoolean.true ? "_done" : "") + ".png",
        iconAnchor:[17.5,40],
        iconSize: [35, 40],
        className:getMarkerDoneClass(boss)
    })

    return <Marker position={boss.coordinates} icon={
        boss.bossType == "REMEMBRANCE"? REMEMBRANCE_MARKER :
            boss.bossType == "INVADER" ? INVADER_MARKER : OPTIONAL_MARKER
    }>
        <Popup open={true}>
            <div className={`${style.markerInfos}`}>
                <h1 className={style.markerTitle}>{boss.name}</h1>
                <div className={`${style.markerBossInfo}`}>
                    <Attribute title={"Region"} text={boss.region} className={style.markerBossAttribute}/>
                    <Attribute title={"Location"} text={boss.location} className={style.markerBossAttribute}/>
                    <Attribute title={"Drops"} text={boss.drops .length > 0 ? arrayToString(boss.drops) : "No drops."} className={style.markerBossAttribute}/>
                    <Attribute title={"Notes"} text={boss.notes || "No infos."} className={style.markerBossAttribute}/>
                    <div className={style.markerBossAttribute}><b>Killed:</b>
                        <input className={"checkBox"} type={"checkbox"} checked={boss.done == DixieBoolean.true} onChange={(e)=>{
                        if(setKilled){
                            if(e.target.checked){
                                setKilled(boss.id, DixieBoolean.true)
                            } else {
                                setKilled(boss.id, DixieBoolean.false)
                            }
                        }
                    }}/></div>
                </div>
                <div className={style.markerCounterBox}>
                    <b>Total Tries</b>
                    <Counter value={boss.tries}
                             onIncrement={() => {
                                 if (counterFunction) {
                                     counterFunction(boss.id, boss.tries + 1)
                                 }
                             }}
                             onDecrement={() => {
                                 if (counterFunction) {
                                     counterFunction(boss.id, boss.tries - 1)
                                 }
                             }}
                             min={0}
                             disabled={boss.done == DixieBoolean.true}
                    />
                </div>

            </div>
        </Popup>
    </Marker>

}