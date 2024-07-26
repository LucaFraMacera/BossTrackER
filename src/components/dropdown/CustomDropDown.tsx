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
    isVertical?:boolean
}

export function ComplexDropdown({children, title, isVertical}:ComplexDropdownProps){

    const [open, setOpen] = useState(!isVertical)
    const dropdownRef = useRef<HTMLDivElement | null>(null)

    useClickOutside(()=>{
        setOpen(false)
    }, dropdownRef)

    return <div className="dropdown" ref={dropdownRef}>
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