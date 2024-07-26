export enum DixieBoolean {
    false, true
}

export enum MapLayerEnum{
    OVERWORLD="Overworld", UNDERGROUND="Underground", SOTE="Shadow of the Erdtree"
}

export enum BossTypeEnum{
    MAIN="Main Boss", OPTIONAL="Optional", INVADER="Invader", REMEMBRANCE="Remembrance Boss"
}

export type MapLayerType = keyof typeof MapLayerEnum
export type BossType = keyof typeof BossTypeEnum

export type Coordinates = [number, number]

