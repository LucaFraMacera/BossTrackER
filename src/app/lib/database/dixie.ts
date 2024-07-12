import Dexie, {PromiseExtended, Table} from "dexie";
import {Boss} from "db.model";
import {DEFAULT_BOSS_LIST} from "./defaultData"
import {DixieBoolean, QueryResult} from "@/app/lib/types";

export class AppDatabase extends Dexie {
    bosses!: Table<Boss>;
    constructor() {
        super('AppDB')
        this.version(1).stores({
            bosses: '++id, name, location, region, drops, tries, done, notes'
        })
        if (this.bosses) {
            this.bosses.count().then(size => {
                if (size === 0) {
                    this.bosses.bulkAdd(DEFAULT_BOSS_LIST)
                }
            })
        }
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

    public getTotalDeaths(){
        let totalDeaths = 0
        this.bosses.each(boss => totalDeaths += boss.tries)
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

    public getMostTriedBoss(){
        return this.bosses.where("tries").above(0).last()
    }
}