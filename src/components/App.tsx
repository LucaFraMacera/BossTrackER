'use client'

import {createContext} from "react";
import {AppDatabase} from "@/lib/database/dixie";

const DB = new AppDatabase()
export const DatabaseContext = createContext(DB)
export function App({children}){
    return <DatabaseContext.Provider value={DB}>
        {children}
    </DatabaseContext.Provider>
}