'use client'
import {MapContainer} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import {ReactNode} from "react";
import {ERMap} from "@/components/interactive-map/Map";

interface MyMapContainerProps {
    center?: [number, number]
    zoom?: number
    maxZoom?: number
    minZoom?: number
    scrollWheelZoom?: boolean
    maxBounds?: [[number, number], [number, number]]
    bounds?: [[number, number], [number, number]]
    maxBoundsViscosity?: number
    zoomControl?: boolean
}

export default function MyMapContainer({
                                           center,
                                           maxBoundsViscosity,
                                           maxBounds,
                                           bounds,
                                           maxZoom,
                                           zoom,
                                           zoomControl,
                                           minZoom,
                                           scrollWheelZoom,
                                       }: MyMapContainerProps) {

    return <MapContainer center={center} zoom={zoom} maxZoom={maxZoom} minZoom={minZoom}
                         scrollWheelZoom={scrollWheelZoom}
                         maxBounds={maxBounds}
                         bounds={bounds}
                         maxBoundsViscosity={maxBoundsViscosity}
                         zoomControl={zoomControl}>
        <ERMap/>
    </MapContainer>
}