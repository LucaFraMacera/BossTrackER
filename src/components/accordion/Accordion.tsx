'use client'
import {useRef, useState} from "react";
import styles from "@/components/accordion/accordion.module.css"
import {ChevronDownIcon} from "@heroicons/react/16/solid";
import {useClickOutside} from "@/lib/useClickOutside";

interface AccordionProps{
    title:string
}
export function Accordion({title, children}:AccordionProps){

    const [open, setOpen] = useState(false)
    const accordionRef = useRef(null)

    useClickOutside(()=>{
        setOpen(false)
    }, accordionRef)

    return <div className={styles.accordion} ref={accordionRef}>
        <label className={styles["accordion-button"]} onClick={()=>setOpen(!open)}>{title}
            <ChevronDownIcon className={styles["accordion-icon"]}
                            style={{transform:open?"rotate(180deg)":""}}/>
        </label>
        <div style={{maxHeight: open ? "100vh" : "0"}}
             className={styles["accordion-items"]}>
            {children}
        </div>
    </div>

}