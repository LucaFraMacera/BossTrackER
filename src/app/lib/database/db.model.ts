export interface Boss{
    id:number,
    name:string,
    region:string,
    location:string,
    drops:string[],
    tries:number,
    done:0|1,
    notes?:string
}