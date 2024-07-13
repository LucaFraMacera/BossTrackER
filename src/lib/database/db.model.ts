import {DixieBoolean} from "@/lib/types";

export interface Boss{
    id:number,
    name:string,
    region:string,
    location:string,
    drops:string[],
    tries:number,
    done:DixieBoolean,
    notes?:string
}