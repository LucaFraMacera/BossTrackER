'use client'
import styles from "./page.module.css"
import 'leaflet/dist/leaflet.css';
import {ERMap} from "@/components/interactive-map/Map";
import {useMemo} from "react";
import dynamic from "next/dynamic";

const TILE_SIZE = 256

export default function Map(){

    const MyMapContainer = useMemo(() => dynamic(
        () => import('@/components/interactive-map/MyMapContainer'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    return <div className={styles.mapBox}>
        <MyMapContainer center={[0, 0]} zoom={3} maxZoom={6} minZoom={3}
                      scrollWheelZoom={true}
                      maxBounds={[[-TILE_SIZE/2,-TILE_SIZE/2], [TILE_SIZE/2,TILE_SIZE/2]]}
                      bounds={[[-TILE_SIZE/2,-TILE_SIZE/2], [TILE_SIZE/2,TILE_SIZE/2]]}
                      maxBoundsViscosity={0.9}
                      zoomControl={false}/>
    </div>
}