'use client'
import Image from "next/image";
import styles from "./logo.module.css"
import {useEffect, useState} from "react";
import QuestionMarkIcon from "@/components/QuestionMarkIcon";

interface AnimatedLogoProps{
    size?:number
}

export function AnimatedLogo({size}:AnimatedLogoProps){

    const defaultSize = 320
    const [bodySize, setBodySize] = useState(defaultSize)
    const [headSize, setHeadSize] = useState(0)

    useEffect(() => {
        if(!size){
            setHeadSize(224)
        } else {
            setBodySize(size*16)
            setHeadSize((size*0.8)*16)
        }
    }, [size]);

    return <div className={styles["logo"]}>
        <Image src={"/thead2.png"}
               alt="" width={headSize} height="100"
               className={styles["logo-head"]}/>
        <Image src={"/tbody2.png"}
               alt={""} width={bodySize} height="200"
               className={styles["logo-body"]}/>
    </div>
}