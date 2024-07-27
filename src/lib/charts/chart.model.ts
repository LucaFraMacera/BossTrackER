import {Boss} from "@/lib/database/db.model";

export interface ChartDataValue{
    label:string
    value:number
    satellite?:Boss
}

export interface ChartValues{
    name: string;
    datasets: {
        backgroundColor: (string)[];
        borderColor: (string)[];
        data: ChartDataValue[];
        borderWidth: number;
        label: string
    }[];
    labels: string[]
}