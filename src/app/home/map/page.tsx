'use client'
import styles from "./page.module.css"
import 'leaflet/dist/leaflet.css';
import {ERMap} from "@/components/interactive-map/Map";
import {LatLngBounds} from "leaflet";
import {MapContainer} from "react-leaflet";

const TILE_SIZE = 256

export default function Map(){
    const bounds = new LatLngBounds([-TILE_SIZE/2,-TILE_SIZE/2], [TILE_SIZE/2,TILE_SIZE/2])

    return <div className={styles.mapBox}>
        <MapContainer center={[0, 0]} zoom={3} maxZoom={6} minZoom={3}
        scrollWheelZoom={true}
        maxBounds={bounds}
        bounds={bounds}
        maxBoundsViscosity={0.9}
        zoomControl={false}>
        <ERMap/>
    </MapContainer>
    </div>
}