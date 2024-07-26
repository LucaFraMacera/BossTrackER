import {ReactNode, useState} from "react";
import {
    AdjustmentsHorizontalIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon
} from "@heroicons/react/16/solid";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {useScreenSize} from "@/lib/useScreenSize";

interface ComplexDropdownProps{
    title:string
    children:ReactNode
    isVertical?:boolean
}

export function ComplexDropdown({children, title, isVertical}:ComplexDropdownProps){

    const [open, setOpen] = useState(!isVertical)
    const {isSmall} = useScreenSize()

    return <div className="dropdown">
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