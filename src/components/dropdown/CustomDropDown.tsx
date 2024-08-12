'use client'
import {ReactNode, useRef, useState} from "react";
import {
    AdjustmentsHorizontalIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon
} from "@heroicons/react/16/solid";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {useScreenSize} from "@/lib/useScreenSize";
import {useClickOutside} from "@/lib/useClickOutside";

interface ComplexDropdownProps{
    title:string
    children:ReactNode
    isOpen?:boolean
}

export function ComplexDropdown({children, title, isOpen}:ComplexDropdownProps){

    const [open, setOpen] = useState(isOpen)
    const dropdownRef = useRef<HTMLDivElement | null>(null)

    useClickOutside(()=>{
        setOpen(false)
    }, dropdownRef)

    return <div className="dropdown"
                ref={dropdownRef}
                style={{
                    boxShadow: open ? "-0.5rem 0.5rem 0.5rem var(--background-primary)"
                        : "",
                }}>
        <>
            <label onClick={()=>setOpen(!open)}>
                {open ? <>{title} <XMarkIcon className={"icon"}/></> : <AdjustmentsHorizontalIcon className={"icon bordered-icon"}/>}
            </label>
            <div style={{
                maxWidth: open ? "50vw" : "0",
            }}
                 className="dropdown-items">
                {children}
            </div>
        </>
    </div>

}