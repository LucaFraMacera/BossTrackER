import Dexie, {Table} from "dexie";
import {Boss, BossFilters, RegionDataItem} from "@/lib/database/db.model";
import {DEFAULT_BOSS_LIST} from "./defaultData"
import {DixieBoolean, MapLayerType} from "@/lib/types";
import {xor} from "@/lib/utils";


export class AppDatabase extends Dexie {
    bosses!: Table<Boss>;
    constructor() {
        super('AppDB')
        this.version(1).stores({
            bosses: '++id, name, location, region, mapLayer, done, tries'
        })
        if (this.bosses) {
            this.bosses.count().then(size => {
                if (size === 0) {
                    this.bosses.bulkAdd(DEFAULT_BOSS_LIST)
                }
            })
        }
    }

    public getBoss(id:number){
        return this.bosses.where({id:id}).first()
    }

    public async getAllRegions(map?:MapLayerType){
        const regionMap = new Map<string, string>()
        const result :Boss[] = []
        if(map){
            result.push(...await this.bosses.where("mapLayer").equals(map).sortBy("region"))
        } else {
            result.push(...await this.bosses.orderBy("region").sortBy("region"))
        }
        result.map(boss => regionMap.set(boss.region, boss.region))
        return Array.from(regionMap.keys())
    }

    public getDefeatedBossesCount(){
        return this.bosses.where({done:DixieBoolean.true}).count()
    }

    public getTotalBossesCount(){
        return this.bosses.count()
    }

    public getNextBossToKill(region?:string){
        if(region) {
            return this.bosses.where({
                region:region,
                done:DixieBoolean.false})
            .first()
        }
        return this.bosses.where({
            done:DixieBoolean.false
        }).first()
    }

    public async getTotalDeaths(){
        let totalDeaths = 0
        await this.bosses.each(boss => totalDeaths += boss.tries)
        return totalDeaths
    }

    public async getTotalDeathsForRegions(){
        const regionsMap = new Map<string, number>()
        await this.bosses.each(boss =>{
            if(regionsMap.has(boss.region)){
                regionsMap.set(boss.region, regionsMap.get(boss.region)+boss.tries)
            } else {
                regionsMap.set(boss.region, boss.tries)
            }

        })
        return Array.from(regionsMap.entries())
    }

    public async getDeathsPerRegion(){
        const result:Map<string, RegionDataItem> = new Map<string, RegionDataItem>
        await this.bosses.each(boss=>{
            const value = result.get(boss.region)
            const data:RegionDataItem={
                deaths:boss.tries,
                mostTried:boss
            }
            if(!value){
                result.set(boss.region, data)
            } else {
                result.set(boss.region, {
                    deaths:value.deaths+boss.tries,
                    mostTried: value.mostTried?.tries >= boss.tries ? value.mostTried : boss
                })
            }
        })
        return Array.from(result.entries())
    }

    public getMostTriedBoss(){
        return this.bosses.where("tries").above(0).last()
    }

    public getMostDeaths(region?:string){
        if(region){
            return this.bosses.filter(boss => {
                return boss.tries >= 0 && boss.region === region
            }).last()
        }
        return this.bosses.filter(boss => {
            return boss.tries > 0
        }).last()
    }

    public setTries(id:number, tries:number){
        return this.bosses.update(id, {tries:tries})
    }

    public setDone(id:number, done:DixieBoolean){
        return this.bosses.update(id, {done:done})
    }

    public getBosses(filters?:BossFilters){
        if(!filters){
            return this.bosses.toArray()
        }
        return this.bosses.filter((boss)=>{
            const name = boss.name.toLowerCase()
            const location = boss.location.toLowerCase()
            const hasNameAndLocation = !filters.search ||
                name.includes(filters.search.toLowerCase()) ||
                location.includes(filters.search.toLowerCase())
            const hasRegion = !filters.region || boss.region === filters.region
            const nightly = location.toLowerCase().includes("at night")
            const isAtNight = filters.night == undefined || !xor(nightly, filters.night == DixieBoolean.true)
            const isMap = !filters.map || boss.mapLayer === filters.map
            const isKilled = !filters.killed || boss.done == filters.killed
            return hasNameAndLocation && hasRegion && isAtNight && isMap && isKilled
        }).sortBy("id")
    }

    public async getStatsPerRegion(){
        const bossMaps = new Map<string, [number, number]>()
        await this.bosses.each((boss)=>{
            if(bossMaps.has(boss.region)){
                let [defeated, total] = bossMaps.get(boss.region)
                if(boss.done == DixieBoolean.true){
                    defeated = defeated+1
                }
                bossMaps.set(boss.region, [defeated, total+1])
            } else {
                let defeated = 0
                if(boss.done == DixieBoolean.true){
                    defeated = defeated+1
                }
                bossMaps.set(boss.region, [defeated, 1])
            }
        })
        return Array.from(bossMaps)
    }

}