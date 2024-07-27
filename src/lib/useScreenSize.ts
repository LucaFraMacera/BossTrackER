import {useWindow} from "@/lib/useWindow";
import {useEffect, useState} from "react";
import {isSmallScreen} from "@/lib/utils";

interface useScreenSizeResult{
    height:number
    width:number
    isSmall:boolean
}

export function useScreenSize():useScreenSizeResult{

    const [width, height] = useWindow()
    const [isSmall, setIsSmall] = useState<boolean>(false)

    useEffect(() => {
        setIsSmall(isSmallScreen())
    }, [width, height]);

    return {
        height:height,
        width:width,
        isSmall:isSmall
    }


}