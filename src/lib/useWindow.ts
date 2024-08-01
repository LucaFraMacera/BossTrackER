'use client'
import {useEffect, useState} from "react";

export function useWindow(){

    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)

    function updateSize() {
        setHeight(window.innerHeight)
        setWidth(window.innerWidth)
    }

    useEffect(()=>{
        window.addEventListener("resize", updateSize)
        return ()=>window.removeEventListener("resize", updateSize)
    },[])

    return [width, height]

}