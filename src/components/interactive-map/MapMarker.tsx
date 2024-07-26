import {Boss} from "@/lib/database/db.model";
import {icon} from "leaflet";
import {Marker, Popup} from "react-leaflet";
import remembranceMarker from "@public/icons/remembrance_marker.png"
import invasionMarker from "@public/icons/invasion_marker.png"
import optionalMarker from "@public/icons/optional_marker.png"
import {Attribute} from "@/components/Attribute";
import {Counter} from "@/components/counter/Counter";
import style from "@/components/interactive-map/map.module.css"
import {DixieBoolean} from "@/lib/types";


interface MapMarkerProps{
    boss:Boss,
    counterFunction?:(bossId:number, tries:number)=>void
    setKilled?:(bossId:number, killed:DixieBoolean)=>void
}

export function MapMarker({boss, counterFunction, setKilled}:MapMarkerProps){

    const REMEMBRANCE_MARKER = icon({
        iconUrl: remembranceMarker['src'],
        iconAnchor:[17.5,40],
        iconSize: [35, 40],
    })

    const INVADER_MARKER = icon({
        iconUrl: invasionMarker['src'],
        iconAnchor:[17.5,40],
        iconSize: [35, 40],
    })

    const OPTIONAL_MARKER = icon({
        iconUrl: optionalMarker['src'],
        iconAnchor:[17.5,40],
        iconSize: [35, 40],
    })

    function getDropString(drops:string[]){
        if(drops.length == 0){
            return "No drops."
        }
        return drops.reduce((previousValue, currentValue, index)=>{
            return previousValue+", "+currentValue
        })
    }

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
                    <Attribute title={"Drops"} text={getDropString(boss.drops)} className={style.markerBossAttribute}/>
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