'use client'
import Dexie, {Table} from "dexie";
import {Boss, BossFilters, NGData, RegionDataItem} from "@/lib/database/db.model";
import {DEFAULT_BOSS_LIST} from "./defaultData"
import {DixieBoolean, MapLayerType} from "@/lib/types";
import {xor} from "@/lib/utils";
import fakeIndexedDB from "fake-indexeddb";

export class AppDatabase extends Dexie {
    bosses!: Table<Boss>;
    ngData!: Table<NGData>;

    constructor() {
        try {
            super('AppDB', {
                indexedDB:indexedDB
            })
            this.version(1).stores({
                bosses: '++id, name, location, region, mapLayer, done, tries',
                ngData: '++id, level, startDate, endDate, deaths'
            })
            if (this.bosses) {
                this.updateBossList();
            }
            if (this.ngData) {
                this.ngData.count().then((size) => {
                    if (size === 0) {
                        const currentDate = new Date()
                        this.ngData.add({
                            level: 0,
                            startDate: `${currentDate.toLocaleDateString()}, ${currentDate.toLocaleTimeString()}`
                        })
                    }
                })
            }
        }catch (error){
            super("AppDB", {
                indexedDB:fakeIndexedDB
            })
        }
    }

    public getBoss(id: number) {
        return this.bosses.where({id: id}).first()
    }

    public async resetBosses() {
        try {
            const totalDeaths = await this.getTotalDeaths()
            const totalBossesDefeated = await this.getDefeatedBossesCount()
            const mostDifficult = await this.getMostTriedBoss()
            const canProgress = await this.canProgressNgLevel()
            if (!canProgress && totalBossesDefeated !== (await this.bosses.count())) {
                return
            }
            const currentDate = new Date()
            await this.bosses.clear()
            await this.bosses.bulkAdd(DEFAULT_BOSS_LIST)
            const currentNG = await this.getCurrentNGLevel()
            const currentDateString = `${currentDate.toLocaleDateString()}, ${currentDate.toLocaleTimeString()}`
            await this.ngData.update(currentNG?.id,
                {
                    endDate: currentDateString,
                    deaths: totalDeaths,
                    bossDeathRatio: parseFloat((totalBossesDefeated / Math.max(1, totalDeaths)).toFixed(2)),
                    mostDifficult: mostDifficult,
                    defeatedBossesCount: totalBossesDefeated
                })
            await this.ngData.add({
                level: currentNG ? currentNG.level + 1 : 1,
                startDate: currentDateString,
            })
        } catch (error) {
            console.error(error)
        }
    }

    public getCurrentNGLevel() {
        return this.ngData.toCollection().last()
    }

    public async canProgressNgLevel() {
        const lastBoss = await this.bosses.where({name: "Radagon of the Golden Order & Elden Beast"}).first()
        if (!lastBoss) {
            return false
        }
        return lastBoss.done == DixieBoolean.true
    }

    public getNgHistory() {
        return this.ngData.where("endDate").notEqual("").toArray()
    }


    public async getAllRegions(map?: MapLayerType) {
        const regionMap = new Map<string, string>()
        const result: Boss[] = []
        if (map) {
            result.push(...await this.bosses.where("mapLayer").equals(map).sortBy("region"))
        } else {
            result.push(...await this.bosses.orderBy("region").sortBy("region"))
        }
        result.map(boss => regionMap.set(boss.region, boss.region))
        return Array.from(regionMap.keys())
    }

    public getDefeatedBossesCount() {
        return this.bosses.where({done: DixieBoolean.true}).count()
    }

    public getTotalBossesCount() {
        return this.bosses.count()
    }

    public getNextBossToKill(region?: string) {
        if (region) {
            return this.bosses.where({
                region: region,
                done: DixieBoolean.false
            })
                .first()
        }
        return this.bosses.where({
            done: DixieBoolean.false
        }).first()
    }

    public async getTotalDeaths() {
        let totalDeaths = 0
        await this.bosses.each(boss => totalDeaths += boss.tries)
        return totalDeaths
    }

    public async getDeathsPerRegion() {
        const result: Map<string, RegionDataItem> = new Map<string, RegionDataItem>
        await this.bosses.each(boss => {
            const value = result.get(boss.region)
            const data: RegionDataItem = {
                deaths: boss.tries,
                mostTried: boss
            }
            if (!value) {
                result.set(boss.region, data)
            } else {
                result.set(boss.region, {
                    deaths: value.deaths + boss.tries,
                    mostTried: value.mostTried && value.mostTried.tries >= boss.tries ? value.mostTried : boss
                })
            }
        })
        return Array.from(result.entries())
    }

    public getMostTriedBoss() {
        return this.bosses.where("tries").above(0).last()
    }

    public setTries(id: number, tries: number) {
        return this.bosses.update(id, {tries: tries})
    }

    public setDone(id: number, done: DixieBoolean) {
        return this.bosses.update(id, {done: done})
    }

    public getBosses(filters?: BossFilters) {
        if (!filters) {
            return this.bosses.toArray()
        }
        const [sortBy, direction] = filters.sortBy ? filters.sortBy : ["id", "ASC"]
        let result = this.bosses.filter((boss) => {
            const name = boss.name.toLowerCase()
            const location = boss.location.toLowerCase()
            const hasNameAndLocation = !filters.search ||
                name.includes(filters.search.toLowerCase()) ||
                location.includes(filters.search.toLowerCase())
            const hasRegion = !filters.region || boss.region === filters.region
            const nightly = location.toLowerCase().includes("at night")
            const isAtNight = filters.night == undefined || !xor(nightly, filters.night == DixieBoolean.true)
            const isMap = !filters.map || boss.mapLayer === filters.map
            const isKilled = filters.killed === undefined || boss.done == filters.killed
            return hasNameAndLocation && hasRegion && isAtNight && isMap && isKilled
        })
        if (direction === "DESC") {
            result = result.reverse()
        }
        return result.sortBy(sortBy)
    }

    public async getStatsPerMap() {
        const bossMaps = new Map<string, Map<string, [number, number]>>()
        await this.bosses.each((boss) => {
            if (bossMaps.has(boss.mapLayer)) {
                const regions = bossMaps.get(boss.mapLayer)!
                if (regions.has(boss.region)) {
                    let [defeated, total] = regions.get(boss.region)!
                    if (boss.done == DixieBoolean.true) {
                        defeated = defeated + 1
                    }
                    regions.set(boss.region, [defeated, total + 1])
                } else {
                    let defeated = 0
                    if (boss.done == DixieBoolean.true) {
                        defeated = defeated + 1
                    }
                    regions.set(boss.region, [defeated, 1])
                }
                bossMaps.set(boss.mapLayer, regions)
            } else {
                const newRegion = new Map<string, [number, number]>()
                let defeated = 0
                if (boss.done == DixieBoolean.true) {
                    defeated = defeated + 1
                }
                newRegion.set(boss.region, [defeated, 1])
                bossMaps.set(boss.mapLayer, newRegion)
            }

        })
        return Array.from(bossMaps)
    }

    private updateBossList(){
        DEFAULT_BOSS_LIST.map(boss=>{
            this.getBoss(boss.id).then(foundBoss =>{
                if(foundBoss){
                    this.bosses.update(boss.id, {
                        name:boss.name,
                        notes:boss.notes,
                        region: boss.region,
                        location: boss.location,
                        bossType : boss.bossType,
                        mapLayer : boss.mapLayer,
                        coordinates : boss.coordinates,
                        drops : boss.drops
                    })
                } else {
                    this.bosses.add(boss)
                }
            })
        })
    }

}