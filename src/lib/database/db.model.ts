import {BossType, Coordinates, DixieBoolean, MapLayerEnum, MapLayerType} from "@/lib/types";

export interface Boss{
    id:number,
    name:string,
    region:string,
    location:string,
    mapLayer:MapLayerType,
    bossType:BossType,
    drops:string[],
    tries:number,
    done:DixieBoolean,
    notes?:string
    coordinates:Coordinates
}

export interface BossFilters{
    search?:string
    region?:string
    map?:MapLayerType,
    bossType?:BossType
    night?:DixieBoolean
    killed?:DixieBoolean
}

export interface RegionDataItem{
    deaths:number
    mostTried:Boss|undefined
}